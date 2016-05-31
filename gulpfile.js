var gulp=require("gulp"),
    babel=require("gulp-babel"),
    sourcemaps=require("gulp-sourcemaps"),
    plumber=require("gulp-plumber"),
    browserSync = require("browser-sync").create();

gulp.task("babel",function(){
 return gulp
  .src("src/**/*.js")
  .pipe(plumber())
  .pipe(babel())
  .dest("js")
});

gulp.task("server",function(){
 browserSync.init({
  server:{
   baseDir: "./"
  }
 });
});

gulp.task("js-watch",["babel"],browserSync.reload);

gulp.task("watch",["server"],function(){
 gulp.watch("./index.*",browserSync.reload);
 gulp.watch("src/**/*.js",["js-watch"]);
});

gulp.task("default",["watch"]);
