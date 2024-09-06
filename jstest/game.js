//定数宣言
const SCREEN_W = 640;
const SCREEN_H = 480;

const MFRAMENUM = 60;
const FRAMERATE = 60;

//グローバル変数
var mstarttime;
var mcount = 0;

var key_up = false;
var key_down = false;
var key_left = false;
var key_right = false;
var key_z = false;

var jikibmp = new Image();
var jitamabmp = new Image();
var tekibmp = new Image();

var jitamas = [];
var tekis = [];
var jichara = {
	img: jikibmp,
	x: 24,
	y: 16,
	trigger: 0,
	image_w: 48,
	image_h: 32,
	bounds_w: 32,
	bounds_h: 20,
	speed: 4,
	move() {
		//自キャラ移動
		if (key_up)		this.y -= this.speed;
		if (key_down)	this.y += this.speed;
		if (key_left)	this.x -= this.speed;
		if (key_right)	this.x += this.speed;
		if (this.x < 24)	this.x = 24;
		if (this.y < 16)	this.y = 16;
		if (this.x > 616)	this.x = 616;
		if (this.y > 464)	this.y = 464;

		//弾の発射
		if (key_z && this.trigger == 0) {
			if (jitamas.length < 3) {
				var jitama = {
					img: jitamabmp,
					x: this.x,
					y: this.y,
					life: 1,
					image_w: 64,
					image_h: 16,
					bounds_w: 48,
					bounds_h: 12,
					speed: 10,
					move() {
						//弾の移動
						this.x += this.speed;

						//画面外に出たときの処理
						if (this.x > 672) this.life = 0;

						if (this.life > 0) return true;
						return false;
					}
				};
				jitamas.push(jitama);
			}
			this.trigger = 20;
		}
		if (this.trigger > 0) this.trigger--;
	}
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

//画像読み込み
jikibmp.src = "media/test_jiki.png";
jitamabmp.src = "media/test_tama.png";
tekibmp.src = "media/test_teki.png";

//初期化
jichara.x = 24;
jichara.y = 16;
jitamas = [];
tekis = [];
for (var i = 0; i < 50; i++) {
	var teki = {
		img: tekibmp,
		life: 1,
		x: 64 + Math.random() * 500 | 0,
		y: Math.random() * 480 | 0,
		image_w: 32,
		image_h: 32,
		bounds_w: 20,
		bounds_h: 20,
		move() {
			if (this.life > 0) return true;
			return false;
		}
	};
	tekis.push(teki);
}

//メインループ
function main() {
	updateFrameRate();

	jichara.move();
	for (var i = 0; i < jitamas.length; i++) {
		if(!(jitamas[i].move())) jitamas.splice(i, 1);
	}
	for (var i = 0; i < tekis.length; i++) {
		if(!(tekis[i].move())) tekis.splice(i, 1);
	}
	if (atariHantei()) console.log("ゲームオーバー");

	ctx.clearRect(0, 0, 640, 480);
	ctx.drawImage(jichara.img, jichara.x - (jichara.image_w >> 1), jichara.y - (jichara.image_h >> 1));
	for (var i = 0; i < jitamas.length; i++) {
		var jt = jitamas[i];
		ctx.drawImage(jt.img, jt.x - (jt.image_w >> 1), jt.y - (jt.image_h >> 1));
	}
	for (var i = 0; i < tekis.length; i++) {
		var t = tekis[i];
		ctx.drawImage(t.img, t.x - (t.image_w >> 1), t.y - (t.image_h >> 1));
	}

	waitFrameRate();
}
main();

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
		retval = true;
	}
	return retval;
}

function atariHantei() {
	for (var i = 0; i < tekis.length; i++) {
		var t = tekis[i];
		//自機と敵の判定
		if (isAtari(jichara, t)) return true;
		//弾と敵の判定
		for (var j = 0; j < jitamas.length; j++) {
			var jt = jitamas[j];
			if (isAtari(jt, t)) {
				jt.life = 0;
				jitamas.splice(j, 1);
				t.life = 0;
				tekis.splice(i, 1);
			}
		}
	}
	return false;
}