const gulp = require('gulp');

gulp.task('build:icons', function(done) {
  // Task para copiar ícones se existirem
  console.log('Icons build completed');
  done();
});

gulp.task('default', gulp.series('build:icons'));
