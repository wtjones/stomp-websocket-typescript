const gulp = require('gulp');
const ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json',{noImplicitAny: true});
const del = require('del');
const minify = require('gulp-minify');
const chmod = require('gulp-chmod');
(function(){
        var self = this;
        
        self.source = {};
        self.source.typescript = {};
        self.source.css = {};
        self.source.scss = {};
        self.source.all = {};
        self.source.fonts = {};
        self.source.html = {};
        self.source.images = {};
        self.source.all.typescript = {};
        self.source.javascript = {};
        self.source.path = 'clientApp/';
        self.source.javascript.path = self.source.path + 'js/**/*.js';
        self.source.all.typescript = self.source.path + 'ts/**/*.ts';

        self.destination = {};
        self.destination.html = {};
        self.destination.javascript = {};
        self.destination.images = {};
        self.destination.css = {};
        self.destination.fonts = {};
        self.destination.path = "dist/";
        self.destination.html.path = self.destination.path;        
        self.destination.javascript.path = self.destination.path + 'js';

        gulp.task("js", function(){
                    return gulp.src(self.source.javascript.path)
                .pipe(chmod(0o755))
                .pipe(gulp.dest(self.destination.javascript.path))
            });
        gulp.task('clean:dist', function() {
            return del.sync(self.destination.path);
        })

        gulp.task('typescript', function() {
            return tsProject.src() 
                .pipe(tsProject({
                    allowJs: true
                })).js.pipe(minify())
                .pipe(chmod(0o755))
                .pipe(gulp.dest(self.destination.javascript.path));
        });

        gulp.task("watch", function(){
            gulp.watch(self.source.all.typescript, function(){
                gulp.start("typescript");
            });
            gulp.watch(self.source.javascript.path, function(){
                gulp.start("js");
            });
        });

        gulp.task("develop",function(){
           gulp.start("clean:dist");
           gulp.start("typescript");
           gulp.start("js");
           gulp.start("watch");
        });

}());
