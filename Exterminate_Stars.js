var game = {
  score: 0,
  data: null,
  copedata: null,
  before: null,
  later: null,
  width: null,
  pic_num: 5,
  RN: 15,
  CN: 15,
  base_num: 5000,
  increase_num: 1000,
  target: null,
  level: 1,
  //1构建数据数组函数
  setdata(){
    this.data = new Array();
    for (var r = 0; r < this.RN; r++) {
      this.data[r] = new Array();
      for (var c = 0; c < this.CN; c++) {
        this.data[r][c] = Math.floor(Math.random() * this.pic_num + 1);
      }
    }
  },
  //2构建辅助数组数据
  setcopedata(){
    this.copedata = new Array();
    for (var r = 0; r < this.RN; r++) {
      this.copedata[r] = new Array();
      for (var c = 0; c < this.CN; c++) {
        this.copedata[r][c] = 0;
      }
    }
  },
  //3.更新视图
  sethtml(){
    var html = "";
    for (var r = 0; r < this.RN; r++) {
      html += "<div class='row'>";
      for (var c = 0; c < this.CN; c++) {
        if (this.data[r][c] !== 0) {
          html += "<div class='col'><img id=" + "c" + r + "_" + c + " src=./" + this.data[r][c] + ".jpg></div>";
        } else {
          html += "<div class='col'></div>";
        }

      }
      html += "</div>";
    }
    $("#contain").html(html);
    $("#score_target span").html(this.target);
    $("#score span").html(this.score);
    $("#level span").html(this.level);
    this.setstyle();
  },
  //设置样式
  setstyle(){
    $("#title").css({"width": this.CN * this.width - 10 + "px"});
    $("#contain").css({"width": this.CN * this.width + "px", "height": this.RN * this.width + "px"});
    $(".row").css({"width": "100%", "height": 100 / this.RN + "%"});
    $(".col").css({"width": 100 / this.CN + "%", "height": "100%", "float": "left"});
    $("img[id^='c']").css({"width": "100%"});
    if (this.score >= this.target) {
      $("#score span").css({"color": "green"})
    } else {
      $("#score span").css({"color": "red"})
    }
    ;
  },
  // 4.绑定单击事件
  event(){
    //给每个图片绑定事件函数
    $('img').each(function () {
      $(this).attr({"verify": "false"})
      //图片的行号
      var c = ($(this).parent()).index();
      //图片的列号
      var r = ($(this).parent().parent()).index();
      //图片的src
      var src = $(this).attr("src");
      //传入r,c,src
      $(this).click(function () {
        //找到点击图片所有相邻的图片保存在copedata中
        game.dg(r, c, src);
      });
    })
  },
  // 4.1递归函数
  dg(r, c, src){
    //如果单击的图片在copedata中为0
    if (this.copedata[r][c] == 0) {
      //则重置copedata
      this.setcopedata();
      //重置verify属性为false
      $("img").attr({"verify": "false"});
      //重置opacity属性为1
      $("img").css({"opacity": "1"});
      //记录辅助数组前
      this.before = String(this.copedata);
      //记录单击图片数据
      this.copedata[r][c] = src;
      //记录辅助数组后
      this.later = String(this.copedata);
      //循环
      this.lp();
      //  否则绑定消除函数
    } else {
      //判断储存数组copedata中非0的个数
      var i = this.judge_arr_num(this.copedata);
      if (i >= 2) {
        //消除元素
        for (var r = 0; r < this.RN; r++) {
          for (var c = 0; c < this.CN; c++) {
            if (this.copedata[r][c] !== 0) {
              console.log($("#c" + r + "_" + c))
              $("#c" + r + "_" + c).remove();
              this.data[r][c] = 0;
            }
          }
        }
        // 增加分数
        if (i <= 10) {
          this.score += Math.pow(2, i);
        } else {
          this.score += Math.pow(2, 10) + (i - 10) * 512;
        }
        //则重置copedata
        this.setcopedata();
        //移动数据
        this.move();
        //更新视图
        this.sethtml();
        //绑定事件
        this.event();
        //判断是否结束；
        if (this.isgameover()) {
          var i = this.judge_arr_num(this.data) + 1;
          if (i <= 11) {
            this.score += Math.floor(2000 / i);
            if (this.score >= this.target) {
              $("#end span").html("SCORE:+" + Math.floor(2000 / i));
              $("#end").css({"display": "block"});
              setTimeout(function () {
                $("#score span").html(game.score)
              }, 1000);
            } else {
              $("#end_level").html(this.level - 1);
              $("#gameover").css({"display": "block"});
            }
          } else {
            if (this.score >= this.target) {
              $("#end span").html("SCORE:+" + 0);
              $("#end").css({"display": "block"});
            } else {
              $("#end_level").html(this.level - 1);
              $("#gameover").css({"display": "block"});
            }
          }
        }
      }
    }
  },
  // 4.1.1循环函数
  lp(){
    //如果记录的辅助数组前后不相等则:
    if (this.before !== this.later) {
      //辅助数组钱等于现在的辅助数组
      this.before = String(this.copedata);
      //如果辅助数组的值不等0则判断数据数组此位置的值与四周是否相等
      //如果相等且辅助数组此位置的值等于0 则用辅助数组记录此值;
      for (var r = 0; r < this.RN; r++) {
        for (var c = 0; c < this.CN; c++) {
          //辅助数组是否为0
          if (this.copedata[r][c] !== 0) {
            //标记元素透明度为0.7
            $("#c" + r + "_" + c).css({"opacity": "0.7"});
            //*************
            //标记verify属性值为true
            //$("#c" + r+"_" + c).attr({"verify": "true"});
            //**************
            //数据数组在此位置是否与右相等
            if (this.data[r][c] == this.data[r][c + 1]) {
              //如果辅助数组在此位置的值等于0则记录此数据
              this.copedata[r][c + 1] = this.copedata[r][c];
            }
            //  数据数组在此位置是否与左相等
            if (this.data[r][c] == this.data[r][c - 1]) {
              //如果辅助数组在此位置的值等于0则记录此数据
              this.copedata[r][c - 1] = this.copedata[r][c];
            }
            //如果this.data[r-1]存在
            if (this.data[r - 1]) {
              //  数据数组在此位置是否与上相等
              if (this.data[r][c] == this.data[r - 1][c]) {
                //如果辅助数组在此位置的值等于0则记录此数据
                this.copedata[r - 1][c] = this.copedata[r][c];
              }
            }
            //如果this.data[r+1]存在
            if (this.data[r + 1]) {
              //  数据数组在此位置是否与下相等
              if (this.data[r][c] == this.data[r + 1][c]) {
                //如果辅助数组在此位置的值等于0则记录此数据
                this.copedata[r + 1][c] = this.copedata[r][c];
              }
            }
          }
        }
      }
      //记录辅助数组后
      this.later = String(this.copedata);
      this.lp();
    }
  },
// 判断是否结束
  isgameover(){
    for (var r = 0; r < this.RN - 1; r++) {
      for (var c = 0; c < this.CN; c++) {
        if (this.data[r][c] == this.data[r + 1][c] && this.data[r][c] !== 0) {
          return false;
        }
      }
    }
    for (var r = 0; r < this.RN; r++) {
      for (var c = 0; c < this.CN - 1; c++) {
        if (this.data[r][c] == this.data[r][c + 1] && this.data[r][c] != 0) {
          return false;
        }
      }
    }
    return true;
  },
//  下移单列数据
  movecoldown(c){
    for (var r = this.RN - 1; r >= 1; r--) {
      for (var i = r - 1; i >= 0; i--) {
        if (this.data[i][c] != 0) {
          if (this.data[r][c] == 0) {
            this.data[r][c] = this.data[i][c];
            this.data[i][c] = 0;
            break;
          }
        }
      }
      //if (this.data[r][c] == 0 && this.data[r - 1][c] != 0) {
      //  this.data[r][c] = this.data[r - 1][c];
      //  this.data[r - 1][c] = 0;
      //  this.movecoldown(c);
      //}
    }
    return;
  },
//  下移所有列数据
  movedown(){
    for (var c = 0; c < this.CN; c++) {
      this.movecoldown(c);
    }
  },
// 判断此列是否为全为0
  isempt(c){
    for (var r = 0; r < this.RN; r++) {
      if (this.data[r][c] != 0) {
        return false;
      }
    }
    return true;
  },
  moveleft(){
    for (var c = 0; c < this.CN - 1; c++) {
      if (this.isempt(c) && c < this.judge_bottom_num()) {
        for (var i = c; i < this.CN - 1; i++) {
          for (var r = 0; r < this.RN; r++) {
            this.data[r][i] = [this.data[r][i + 1], this.data[r][i + 1] = this.data[r][i]][0];
          }
        }
        c--;
      }
    }
    return;
  },
  // 判断最底行不为0的个数
  judge_bottom_num(){
    var i = 0
    for (var c = 0; c < this.CN; c++) {
      if (this.data[this.RN - 1][c] != 0) {
        i++
      }
    }
    return i;
  },
  move(){
    this.movedown();
    this.moveleft();
  },
  judge_arr_num(arr){
    var i = 0;
    for (var r = 0; r < arr.length; r++) {
      for (var c = 0; c < arr[r].length; c++) {
        if (arr[r][c] != 0) {
          i++;
        }
      }
    }
    return i;
  },
  pass(){
    this.level += 1;
    $("#end").css({"display": "none"});
    //运行
    this.target += this.base_num+ (this.level - 1) * this.increase_num;
    this.setdata();
    this.setcopedata();
    this.sethtml();
    this.event();
  },
  rewidth(){
    if(document.documentElement.clientHeight-100>=document.documentElement.clientWidth){
      this.width=parseFloat((document.documentElement.clientWidth-20)/this.CN);
    }else{
      this.width=parseFloat((document.documentElement.clientHeight-100)/this.RN);
    }
  },
  resize(){
    var a=this;
    console.log(a);
    window.onresize=function(){
      a.rewidth();
      a.sethtml();
      a.event();
    }
  },
  start(){
    //重置所有数据
    this.resize();
    this.rewidth();
    this.target = null;
    this.level = 1;
    this.score = 0;
    this.data = null;
    this.copedata = null;
    this.before = null;
    this.later = null;
    $("#gameover").css({"display": "none"});
    $("#end").css({"display": "none"});
    //运行
    this.target += this.base_num+ (this.level - 1) * this.increase_num;
    this.setdata();
    this.setcopedata();
    this.sethtml();
    this.event();
  },
}
game.start();
