var scrollTextCreate = function (context, screenWidth, txt, posY, speed, font, fillStyle) {
      context.font = "normal 20px Verdana" || font;
      context.fillStyle = "#000000" || fillStyle;
      var textWidth = context.measureText(txt).width;
      var startX = speed < 0 ? screenWidth : -textWidth;
      var posX = startX;
      return {          
          update: function (deltaTime) {
                context.fillText(txt, posX, posY); 
                posX += speed * deltaTime;
                if ((speed > 0 && posX >= screenWidth) ||
                    (speed < 0 && posX <= -textWidth)) {
                    posX = startX;
                }
          }
      };
  };

  var trigTextCreate = function (context, screenWidth, txt, posY, startAngle, font, fillStyle) {
      context.font = "normal 20px Verdana" || font;
      context.fillStyle = "#000000" || fillStyle;
      var alphaWidth = context.measureText("Q").width + 2;
      var posX = (screenWidth - txt.length * alphaWidth) / 2;
      var angle = startAngle;
      return {
          update: function (deltaTime) {
                var x, y, an = angle;
                for (var i = 0; i < txt.length; ++i) {
                    x = posX + alphaWidth * i;
                    y = posY + Math.sin(an + startAngle) * 20;
                    context.fillText(txt[i], x, y); 
                    an += Math.PI / 10;
                }

                angle += Math.PI / 10;  
                if (angle > 2 * Math.PI + startAngle) {
                  angle = angle - (2 * Math.PI + startAngle);
                }
          }
      };
  };

  var spaceCreate = function (context, screenWidth, screenHeight) {
      obj = {
          dots: [],
          getVal: function() {
              var i = Math.random();
              if (i > 0.5) {
                  return Math.random() * 5 + 1;
              }

              return -Math.random() * 5 - 1;
          },
          create: function() {
              var o = { };
              o.x = screenWidth / 2;
              o.y = screenHeight / 2;
              o.incX = Math.random() * 10 - 5;
              if (!o.incX) {
                o.incY = this.getVal();  
              }
              else {
                o.incY = Math.random() * 10 - 5;
              }
              return o;
          },
          createDots: function(number) {
            for (var i = 0; i < number; ++i) {
                this.dots.push(this.create());
            }
          },
          update: function (deltaTime) {
                var len = this.dots.length;
                context.beginPath();                    
                for (var i = len - 1; i >= 0 ; --i) {
                    var x = this.dots[i].x;
                    var y = this.dots[i].y;
                    if (x < 0 || x > screenWidth || y < 0 || y > screenHeight) {
                        this.dots.splice(i, 1);
                       // this.dots.length--;
                    }
                    else {
                        this.dots[i].x += this.dots[i].incX;
                        this.dots[i].y += this.dots[i].incY;
                    }
                    if (x != screenWidth && y != screenHeight) {
                      context.moveTo(x, y);
                      context.lineTo(x + 1, y);
                    }
                }
                context.stroke();

                var newCount = parseInt(Math.random() * 20, 10);
                this.createDots(newCount);
          }
      };

      var newCount = parseInt(Math.random() * 100, 10);
      obj.createDots(newCount);
      return obj;
  };
