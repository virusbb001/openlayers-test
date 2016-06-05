var gulp=require("gulp"),
    babel=require("gulp-babel"),
    concat=require("gulp-concat"),
    sourcemaps=require("gulp-sourcemaps"),
    plumber=require("gulp-plumber"),
    eslint=require("gulp-eslint"),
    browserSync = require("browser-sync").create();

gulp.task("eslint",function(){
  return gulp
    .src("src/**/*.js")
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("babel",function(){
  return gulp
    .src("src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat("index.js"))
    .pipe(sourcemaps.write({
      charset: "utf8"
    }))
    .pipe(gulp.dest("js"));
});

gulp.task("server",function(){
  browserSync.init({
    server:{
      baseDir: "./"
    }
  });
});

gulp.task("js-watch",["eslint","babel"],browserSync.reload);

gulp.task("watch",["server"],function(){
  gulp.watch("./index.*",browserSync.reload);
  gulp.watch("src/**/*.js",["js-watch"]);
});

gulp.task("default",["watch","js-watch"]);
