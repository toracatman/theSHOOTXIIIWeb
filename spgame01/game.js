//定数宣言
const SCREEN_W = 640;
const SCREEN_H = 480;

const MFRAMENUM = 60;
const FRAMERATE = 60;

//ゲームの状態を表す定数
const GAME_LOAD = -1;
const GAME_TITLE = 0;
const GAME_MAIN = 1;
const GAME_OVER = 2;
const GAME_CLEAR = 3;

//当たり判定モードを表す定数
const A_GHOST = 0;	//ghost＝判定なし
const A_NORMAL = 1;	//normal＝敵と当たれば消滅
const A_HARD = 2;	//hard＝耐久力を持ち、当たるとlife-1される
const A_MORTAL = 3;	//mortal＝不死
const A_SOFT = 4;	//soft＝ダメージなし

//グローバル変数
var mstarttime;
var mcount = 0;

var key_space = false;
var key_up = false;
var key_down = false;
var key_left = false;
var key_right = false;
var key_z = false;
var key_z_c = 0;

var mouse_lbtn = false;
var mouse_x = 0;
var mouse_y = 0;

var scale;
var draw_w;
var draw_h;
var draw_x;
var draw_y;

var gstate = GAME_LOAD;
var mmode = false;

var starttime;
var animcounter;

//画像読み込み
var gametitlejpg = new Image();
gametitlejpg.src = "../img/gametitle.jpg";
var backjpg = new Image();
backjpg.src = "../img/back01.jpg";

var jikibmp = new Image();
jikibmp.src = "../img/jiki.png";
var jitamabmp = new Image();
jitamabmp.src = "../img/tama.png";
var tekibmp = new Image();
tekibmp.src = "../img/teki00.png";
var bakuenbmp = new Image();
bakuenbmp.src = "../img/bakuen.png";
var jbakuenbmp = new Image();
jbakuenbmp.src = "../img/bakuenj.png";

//音声読み込み
var openmusic = new Audio("../sound/tam-g17.mp3");
openmusic.loop = true;
var backmusic = new Audio("../sound/Galaxy.ogg");
backmusic.loop = true;
var clip1 = new Audio("../sound/bom35.wav");
var clip2 = new Audio("../sound/don18_c.wav");
var clip4 = new Audio("../sound/power33.wav");
var clip5 = new Audio("../sound/hit_p07.wav");
var clip7 = new Audio("../sound/metal27_a.wav");

var jichara = {
	img: jikibmp,
	animpat: 3,
	aweight: 6,
	image_w: 48,
	image_h: 32,
	bounds_w: 32,
	bounds_h: 20,
	amode: A_NORMAL,
	speed: 4,

	//●自キャラデータの初期化（スタート画面から呼び出す）
	init() {
		this.x = 24;
		this.y = 16;
		this.acounter = 0;
		this.trigger = 0;
		this.tweight = 20;
	},

	//●自キャラの移動処理（ゲームメインから呼び出す）
	move() {
		//自キャラ移動
		if (mmode) {
			var dx = mouse_x - this.x;
			var dy = mouse_y - this.y;
			var d = Math.atan2(dy, dx);
			var sx = Math.cos(d);
			var sy = Math.sin(d);
			var s = Math.min(this.speed * Math.SQRT2, Math.abs(dx + dy));
			this.x += sx * s;
			this.y += sy * s;
		}
		else {
			if (key_up)		this.y -= this.speed;
			if (key_down)	this.y += this.speed;
			if (key_left)	this.x -= this.speed;
			if (key_right)	this.x += this.speed;
		}
		if (this.x < 24)	this.x = 24;
		if (this.y < 16)	this.y = 16;
		if (this.x > 616)	this.x = 616;
		if (this.y > 464)	this.y = 464;

		//弾の発射
		if ((key_z || mmode) && this.trigger == 0) {
			if (jitamas.length < 3) {
				var jt = {
					img: jitamabmp,
					x: this.x,
					y: this.y,
					life: 1,
					image_w: 64,
					image_h: 16,
					bounds_w: 48,
					bounds_h: 12,
					amode: A_NORMAL,
					speed: 10,

					//弾の移動
					move() {
						this.x += this.speed;

						//画面外に出たときの処理
						if (this.x > 672) this.life = 0;
					}
				};
				jitamas.push(jt);
			}
			this.trigger = this.tweight;
		}
		if (this.trigger > 0) this.trigger--;
	}
};
var jitamas = [];
var tekis = [];
var bakuens = [];
var hantens = [];
var jbakuen = {
	img: jbakuenbmp,
	animpat: 4,
	image_w: 48,
	image_h: 48
};

//キャンバス、コンテキストの取得
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//キーボード
document.addEventListener("keydown", (e) => {
	if (e.key === "Up" || e.key === "ArrowUp")			key_up = true;
	if (e.key === "Down" || e.key === "ArrowDown")		key_down = true;
	if (e.key === "Left" || e.key === "ArrowLeft")		key_left = true;
	if (e.key === "Right" || e.key === "ArrowRight")	key_right = true;
	if (e.key === "z" || e.key == "Z")					key_z = true;
});
document.addEventListener("keyup", (e) => {
	if (e.key === "Up" || e.key === "ArrowUp")			key_up = false;
	if (e.key === "Down" || e.key === "ArrowDown")		key_down = false;
	if (e.key === "Left" || e.key === "ArrowLeft")		key_left = false;
	if (e.key === "Right" || e.key === "ArrowRight")	key_right = false;
	if (e.key === "z" || e.key == "Z")					key_z = false;
});

//マウス
document.addEventListener("mousedown", (e) => {
	if (e.buttons & 1) mouse_lbtn = true;
});
document.addEventListener("mousemove", (e) => {
	mouse_x = (e.clientX - draw_x) / scale;
	mouse_y = (e.clientY - draw_y) / scale;
});

//●メインループ
function main() {
	updateFrameRate();

	if (key_z)	key_z_c++;
	else		key_z_c = 0;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	scale = Math.min(canvas.width / SCREEN_W, canvas.height / SCREEN_H);
	draw_w = SCREEN_W * scale;
	draw_h = SCREEN_H * scale;
	draw_x = (canvas.width - draw_w) >> 1;
	draw_y = (canvas.height - draw_h) >> 1;
	ctx.setTransform(scale, 0, 0, scale, draw_x, draw_y);

	switch (gstate) {
	case GAME_LOAD:
		gameLoad();
		break;
	case GAME_TITLE:
		gameTitle();
		break;
	case GAME_MAIN:
		gameMain();
		break;
	case GAME_OVER:
		gameOver();
		break;
	case GAME_CLEAR:
		gameClear();
		break;
	}

	ctx.resetTransform();
	ctx.clearRect(0, 0, draw_x, canvas.height);
	ctx.clearRect(draw_x + draw_w, 0, canvas.width, canvas.height);
	ctx.clearRect(0, 0, canvas.width, draw_y);
	ctx.clearRect(0, draw_y + draw_h, canvas.width, canvas.height);

	mouse_lbtn = false;
	animcounter++;
	waitFrameRate();
}
main();

//●ゲーム読み込み画面
function gameLoad() {
	if (key_z || mouse_lbtn) {
		gstate = GAME_TITLE;
		if (mouse_lbtn) mmode = true;
		playSound(openmusic);
	}

	ctx.fillStyle = "#fff";
	ctx.font = "32px 'Mkana+'";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Zキーでキーボードモードでゲーム開始", SCREEN_W >> 1, (SCREEN_H >> 1) - 32);
	ctx.fillText("クリックでマウスモードでゲーム開始", SCREEN_W >> 1, SCREEN_H >> 1);
	ctx.fillText("F11キーで全画面", SCREEN_W >> 1, (SCREEN_H >> 1) + 32);
}

//●ゲームタイトル画面
function gameTitle() {
	if (key_z_c == 1 || mouse_lbtn) {
		gstate = GAME_MAIN;
		jichara.init();
		jitamas = [];
		tekiInit();
		bakuens = [];
		hantens = [];
		animcounter = 0;
		openmusic.pause();
		playSound(clip4);
		playSound(backmusic);
	}

	ctx.drawImage(gametitlejpg, 0, 60);
	ctx.fillStyle = "#f0f";
	ctx.font = "bold 32px 'Mkana+'";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(mmode ? "CLICK TO START" : "PRESS Z KEY", SCREEN_W >> 1, 300);
}

//●ゲーム本体の実行
function gameMain() {
	jichara.move();
	for (var i = 0; i < jitamas.length; i++) jitamas[i].move();
	for (var i = 0; i < tekis.length; i++) tekis[i].move();
	if (atariHantei()) {
		gstate = GAME_OVER;
		starttime = Date.now();
		animcounter = 0;
		jbakuen.acounter = 16;
		backmusic.pause();
		playSound(clip1);
	}

	drawGame(true);

	if (tekis.length == 0) {
		gstate = GAME_CLEAR;
		starttime = Date.now();
		animcounter = 0;
		backmusic.pause();
	}
}

//●ゲームオーバー画面
function gameOver() {
	if (Date.now() - starttime >= 5000 || key_z_c == 1 || mouse_lbtn) {
		gstate = GAME_TITLE;
		playSound(openmusic);
	}

	drawGame(false);

	//爆炎表示
	if (jbakuen.acounter == 16) {
		jbakuen.acounter = 0;
		jbakuen.x = jichara.x + (Math.random() * 64 | 0) - 32;
		jbakuen.y = jichara.y + (Math.random() * 64 | 0) - 32;
	}
	var sx = (jbakuen.acounter / 4 | 0) % jbakuen.animpat * jbakuen.image_w;
	ctx.drawImage(jbakuen.img, sx, 0, jbakuen.image_w, jbakuen.image_h, jbakuen.x - (jbakuen.image_w >> 1), jbakuen.y - (jbakuen.image_h >> 1), jbakuen.image_w, jbakuen.image_h);
	jbakuen.acounter++;

	var s = "GAME OVER";
	ctx.font = "bold 100px 'Mkana+'";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#000";
	ctx.fillText(s, 2 + SCREEN_W >> 1, 2 + SCREEN_H >> 1);
	ctx.fillStyle = "#f00";
	ctx.fillText(s, SCREEN_W >> 1, SCREEN_H >> 1);
}

//●ゲームクリアー画面
function gameClear() {
	if (Date.now() - starttime >= 5000 || key_z_c == 1 || mouse_lbtn) {
		gstate = GAME_TITLE;
		playSound(openmusic);
	}

	drawGame(false);

	var s = "GAME CLEAR";
	ctx.font = "bold 100px 'Mkana+'";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#000";
	ctx.fillText(s, 2 + SCREEN_W >> 1, 2 + SCREEN_H >> 1);
	ctx.fillStyle = "#0ff";
	ctx.fillText(s, SCREEN_W >> 1, SCREEN_H >> 1);
}

//●ゲーム画面の表示
function drawGame(tama) {
	ctx.drawImage(backjpg, 0, 0);

	var sx;
	var sy;
	sx = (jichara.acounter / jichara.aweight | 0) % jichara.animpat * jichara.image_w;
	ctx.drawImage(jichara.img, sx, 0, jichara.image_w, jichara.image_h, jichara.x - (jichara.image_w >> 1), jichara.y - (jichara.image_h >> 1), jichara.image_w, jichara.image_h);
	jichara.acounter++;

	if (tama) {
		for (var i = 0; i < jitamas.length; i++) {
			var jt = jitamas[i];
			if (jt.life > 0) ctx.drawImage(jt.img, jt.x - (jt.image_w >> 1), jt.y - (jt.image_h >> 1));
			else {
				jitamas.splice(i, 1);
				i--;
			}
		}
	}

	for (var i = 0; i < tekis.length; i++) {
		var t = tekis[i];
		if (t.life > 0) {
			sx = t.image_x + (t.acounter / t.aweight | 0) % t.animpat * t.image_w;
			ctx.drawImage(t.img, sx, 0, t.image_w, t.image_h, t.x - (t.image_w >> 1), t.y - (t.image_h >> 1), t.image_w, t.image_h);
			t.acounter++;
		}
		else {
			tekis.splice(i, 1);
			i--;
		}
	}

	for (var i = 0; i < bakuens.length; i++) {
		var b = bakuens[i];
		sx = (b.acounter / 4 | 0) % b.animpat * b.image_w;
		ctx.drawImage(b.img, sx, 0, b.image_w, b.image_h, b.x - (b.image_w >> 1), b.y - (b.image_h >> 1), b.image_w, b.image_h);
		b.acounter++;
		if (bakuens[i].acounter == 16) {
			bakuens.splice(i, 1);
			i--;
		}
	}

	for (var i = 0; i < hantens.length; i++) {
		var h = hantens[i];
		ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
		ctx.fillRect(h.x - (h.image_w >> 1), h.y - (h.image_h >> 1), h.image_w, h.image_h);
		h.acounter++;
		if (hantens[i].acounter == 4) {
			hantens.splice(i, 1);
			i--;
		}
	}
}

function updateFrameRate() {
	if (mcount == 0) mstarttime = Date.now();	//1フレーム目なら時刻を計測
	if (mcount == MFRAMENUM) {					//測定するフレーム目なら繰り返す
		mstarttime = Date.now();
		mcount = 0;
	}
	mcount++;
}

function waitFrameRate() {
	var tooktime = Date.now() - mstarttime;						//かかった時間
	var waittime = (mcount * 1000 / FRAMERATE | 0) - tooktime;	//待つべき時間
	setTimeout(main, waittime);									//待機
}

//●音の再生
function playSound(s) {
	s.currentTime = 0;
	s.play();
}

function isAtari(a, b) {
	var retval = false;
	var ax1 = a.x - (a.bounds_w >> 1);
	var ay1 = a.y - (a.bounds_h >> 1);
	var ax2 = a.x + (a.bounds_w >> 1);
	var ay2 = a.y + (a.bounds_h >> 1);
	var bx1 = b.x - (b.bounds_w >> 1);
	var by1 = b.y - (b.bounds_h >> 1);
	var bx2 = b.x + (b.bounds_w >> 1);
	var by2 = b.y + (b.bounds_h >> 1);
	if (ax1 < bx2 && bx1 < ax2 && ay1 < by2 && by1 < ay2) {
		if (a.amode == A_SOFT || b.amode == A_SOFT) {
			return true;
		}
		switch (a.amode) {
		case A_NORMAL:	//キャラ消滅
			a.life = 0;
			break;
		case A_HARD:	//耐久力-1
			a.life--;
			if (a.life < 0) a.life = 0;
			break;
		case A_MORTAL:	//音を鳴らす
			playSound(clip7);
			break;
		}
		switch (b.amode) {
		case A_NORMAL:	//キャラ消滅
			b.life = 0;
			break;
		case A_HARD:	//耐久力-1
			b.life--;
			if (b.life < 0) b.life = 0;
			if (b.life > 0) setHanten(b.x, b.y, b.image_w, b.image_h);
			break;
		case A_MORTAL:	//音を鳴らす
			playSound(clip7);
			break;
		}
		if (b.life == 0) setBakuen(b.x, b.y);
		retval = true;
	}
	return retval;
}

function atariHantei() {
	for (var i = 0; i < tekis.length; i++) {
		var t = tekis[i];
		if (t.life > 0 && t.amode != A_GHOST) {
			//自機と敵の判定
			if (isAtari(jichara, t)) return true;
			//弾と敵の判定
			for (var j = 0; j < jitamas.length; j++) {
				var jt = jitamas[j];
				if (jt.life > 0) isAtari(jt, t);
			}
		}
	}
	return false;
}

//●爆炎セット
function setBakuen(x, y) {
	var b = {
		img: bakuenbmp,
		animpat: 4,
		acounter: 0,
		x: x,
		y: y,
		image_w: 32,
		image_h: 32
	}
	bakuens.push(b);
	playSound(clip2);
}

//●A_HARD用の反転セット
function setHanten(x, y, w, h) {
	var h = {
		acounter: 0,
		x: x,
		y: y,
		image_w: w,
		image_h: h
	}
	hantens.push(h);
	playSound(clip5);
}

//●敵キャラデータの初期化（スタート画面から呼び出す）
function tekiInit() {
	tekis = [];
	for (var i = 0; i < 50; i++) {
		var t = {
			img: tekibmp,
			animpat: 2,
			acounter: 0,
			aweight: 20,
			life: 2,
			x: 60 + Math.random() * 548 | 0,
			y: 16 + Math.random() * 448 | 0,
			image_x: 0,
			image_w: 32,
			image_h: 32,
			bounds_w: 20,
			bounds_h: 20,
			amode: A_HARD,
			move() {
				if (this.life > 0) return true;
				return false;
			}
		};
		tekis.push(t);
	}
}