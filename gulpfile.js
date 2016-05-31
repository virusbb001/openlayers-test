var gulp=require("gulp"),
    browserSync = require("browser-sync").create();

gulp.task("server",function(){
 browserSync.init({
  server:{
   baseDir: "./"
  }
 });
});

gulp.task("watch",["server"],function(){
 gulp.watch("./index.*",browserSync.reload);
});

gulp.task("default",["watch"]);
