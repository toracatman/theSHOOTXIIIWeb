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

//マップの大きさを表す定数
const CHIP_W = 32;
const CHIP_H = 32;
const MAP_W = SCREEN_W / CHIP_W;
const MAP_H = SCREEN_H / CHIP_H;

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

var mapbmp;	//マップ画像
var mapnum;	//マップ番号
//マップデータ
var mapdat = [
	[
		"0000000000ABCABCABCABCABCABCABCABCAAAAAACAAAAACAAAAAACAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
		"00000000000000000000000GH00000000000000000000000000000000000000000000000000GH0000000000030030000000A",
		"000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000A",
		"000000000000000000000000000000000000000000000000000000000000DEEEEEEEEEEEEEF000000000000000000000000A",
		"000000000000000000000004004000000020200000000001000000000000000030000030000000000110110000000000000A",
		"00000000000000000000000000000000DEEEEEEF000000000000000000000000000000000000000000000000000000000000",
		"0000000000000000000400000000000000000000000000000000000KL0000000000000000000000000000000000000444400",
		"0000000000000000000000000000000000000000000000000000000GH0000000000000000000000000000000000000000000",
		"0000000000000000000000000000000000000000000000000KL0000000000000000000000000004444000000000000000000",
		"0000000000000000000000040040000000000000000000000GH0000000000000000000000000000000000000000000000000",
		"000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000A",
		"000000000000000000000000000000000000000000000000000000000000000000KL00000000000000KL000000000000000A",
		"000000000000000000000000000IJIJIJIJJ00000000000000000000000000000MNOP000IJIJ00000MNOP00000000000000A",
		"000000000000020202000000000QRQRQRQRR000000KL00000000000000000000STUVWX00QRQR0000STUVWX0000020200000A",
		"0000000000DDDDEEFFFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFAAAAAAAAAAAA"
	],
	[
		"0000000000ABCABCABCABCABCABCABCABCAAAAAACAAAAACAAAAAACAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
		"00000000000000000000000GH00000000000000000000000000000010000000000000000000GH0000000000033330000000A",
		"000000000000000000000000000000000000000000000000000000111000000000000000000000000000000000000000000A",
		"000000000000000000000000000000000000000000000001000000010000DEEEEEEEEEEEEEF000000000000000000000000A",
		"000000000000000000000004004000000222222000000011100000000000000033333330000000000110110000000000000A",
		"00000000000000000000000400400000DEEEEEEF000000010000000000000000000000000000000001101100000000000000",
		"0000000000000000000400040040000000000000000000000000000KL0000000000000000000000000000000000000444400",
		"0000000000000000000000040040000000000000000000000000000GH0000000000000000000004444000000000000444400",
		"0000000000000000000000040040000000000000000000000KL0000000000000000000000000004444000000000000000000",
		"0000000000000000000000040040000000000000000000000GH0000000000000000000000000000000000000000000000000",
		"000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000A",
		"000000000000000000000000000000000000000000000000000000000000000000KL00000000000000KL000000000000000A",
		"000000000000000000000000000IJIJIJIJJ00000000000000000000000000000MNOP000IJIJ00000MNOP00000000000000A",
		"000000000000022222000000000QRQRQRQRR000000KL00000000000000000000STUVWX00QRQR0000STUVWX0000022200000A",
		"0000000000DDDDEEFFFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFDEFAAAAAAAAAAAA"
	]
];
var worldx;			//現在のマップ位置（ピクセル単位）
var worldmax;		//マップ横幅（キャラ単位）
var scspeed = 2;	//スクロール速度
var zakobmp;		//ザコ敵の画像
//ザコ敵のパターンデータ
var zakopat = [
	[
		[20, 499, 0],
		[20, -2, 0]
	],
	[
		[40, -2, 0],
		[20, -2, -4],
		[20, -2, 4]
	],
	[
		[40, -2, 0],
		[20, -2, 4]
	],
	[
		[20, -4, -2],
		[10, -2, 0],
		[20, -4, 2],
		[10, -2, 0]
	]
];

//画像読み込み
var gametitlejpg = new Image();
gametitlejpg.src = "../img/gametitle.jpg";
var backjpg = new Image();
backjpg.src = "../img/back05.jpg";

var jikibmp = new Image();
jikibmp.src = "../img/jiki.png";
var jitamabmp = new Image();
jitamabmp.src = "../img/tama.png";
var laserbmp = new Image();
laserbmp.src = "../img/laser.png";
var shieldbmp = new Image();
shieldbmp.src = "../img/shield.png";
var tekibmp = new Image();
tekibmp.src = "../img/teki03.png";
var ttamabmp = new Image();
ttamabmp.src = "../img/tekitama.png";
var bakuenbmp = new Image();
bakuenbmp.src = "../img/bakuen.png";
var jbakuenbmp = new Image();
jbakuenbmp.src = "../img/bakuenj.png";
var mapbmp = new Image();
mapbmp.src = "../img/map01.png";
var zakobmp = new Image();
zakobmp.src = "../img/zako01.png";
var itembmp = new Image();
itembmp.src = "../img/item.png";

//音声読み込み
var openmusic = new Audio("../sound/tam-g17.mp3");
openmusic.loop = true;
var backmusic = new Audio("../sound/debris.mp3");
backmusic.loop = true;
var clip1 = new Audio("../sound/bom35.wav");
var clip2 = new Audio("../sound/don18_c.wav");
var clip3 = new Audio("../sound/shoot22.wav");
var clip4 = new Audio("../sound/power33.wav");
var clip5 = new Audio("../sound/hit_p07.wav");
var clip6 = new Audio("../sound/gun11_r.wav");
var clip7 = new Audio("../sound/metal27_a.wav");

var jichara = {
	img: jikibmp,
	animpat: 3,
	aweight: 6,
	image_w: 48,
	image_h: 32,
	bounds_w: 32,
	bounds_h: 20,
	amode: A_HARD,
	speed: 4,

	//●自キャラデータの初期化（スタート画面から呼び出す）
	init() {
		this.x = 24;
		this.y = 16;
		this.acounter = 0;
		this.life = 3;
		this.trigger = 0;
		this.tweight = 20;
		this.t_way = 0;
		this.laser = 0;
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
		var l = this.image_w >> 1;
		var t = this.image_h >> 1;
		var r = SCREEN_W - (this.image_w >> 1);
		var b = SCREEN_H - (this.image_h >> 1);
		if (this.x < l)	this.x = l;
		if (this.y < t)	this.y = t;
		if (this.x > r)	this.x = r;
		if (this.y > b)	this.y = b;


		//レーザー
		if (this.laser > 0) {
			if ((key_z || mmode)) {
				if (laser.life == 0) playSound(clip6);
				laser.life = 1;
			}
			else {
				laser.life = 0;
			}
			this.laser--;
		}

		else {
			//弾の発射
			if ((key_z || mmode) && this.trigger == 0) {
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
						if (this.x > SCREEN_W + (this.image_w >> 1)) this.life = 0;
					}
				};
				jitamas.push(jt);
				if (this.t_way == 1) {
					for (var i = 0; i < 2; i++) {
						jt = {
							img: jitamabmp,
							x: this.x,
							y: this.y,
							d: -30 + i * 60,
							life: 1,
							image_w: 64,
							image_h: 16,
							bounds_w: 48,
							bounds_h: 12,
							amode: A_NORMAL,
							speed: 10,

							//弾の移動
							move() {
								var r = this.d * Math.PI / 180;
								this.x += Math.cos(r) * this.speed;
								this.y += Math.sin(r) * this.speed;

								//画面外に出たときの処理
								if (this.x > SCREEN_W + (this.image_w >> 1)) this.life = 0;
							}
						};
						jitamas.push(jt);
					}
				}
				this.trigger = this.tweight;
			}
		}
		if (this.trigger > 0) this.trigger--;
	}
};
var jitamas = [];
var laser = {
	img: laserbmp,
	animpat: 1,
	acounter: 0,
	aweight: 1,
	life: 0,
	image_w: 640,
	image_h: 32,
	bounds_w: 640,
	bounds_h: 24,
	amode: 5,
	move() {
		this.x = jichara.x + (this.image_w >> 1);
		this.y = jichara.y;
		if (jichara.laser == 0) this.life = 0;
	}
};
var shield = {
	img: shieldbmp,
	animpat: 1,
	acounter: 0,
	aweight: 1,
	life: 0,
	image_w: 16,
	image_h: 64,
	bounds_w: 12,
	bounds_h: 48,
	amode: A_HARD,
	bakuen: true,
	move() {
		this.x = jichara.x + (jichara.image_w >> 1);
		this.y = jichara.y;
	}
};
var tekis = [];
var bakuens = [];
var hantens = [];
var jbakuen = {
	img: jbakuenbmp,
	animpat: 4,
	image_w: 48,
	image_h: 48
};
var boss = {
	//敵移動パターン
	m: [ [50, 0, 2], [50, -2, 2], [80, -2, 0], [50, -2, -2], [60, 0, -2],
		[50, 2, -2], [80, 2, 0], [50, 2, 2], [10, 0, 2] ],
	//現在参照しているパターン
	cp: 0,
	rp: 0,

	//●敵キャラデータの初期化（スタート画面から呼び出す）
	init() {
		//敵中心位置
		this.x = 500;
		this.y = 200;
		this.d = 0;
		tekis = [];

		//触手初期化
		for (var i = 0; i < 25; i++) {
			var t = {
				img: tekibmp,
				rx: 0,
				ry: 0,
				animpat: 1,
				acounter: 0,
				aweight: 1,
				life: 5,
				image_x: 96,
				image_w: 24,
				image_h: 24,
				bounds_w: 18,
				bounds_h: 18,
				amode: A_HARD,
				bakuen: true,
				move() {
					var r = boss.d * Math.PI / 180;
					this.x = boss.x + Math.cos(r) * this.rx - Math.sin(r) * this.ry;
					this.y = boss.y + Math.sin(r) * this.rx + Math.cos(r) * this.ry;

					//砲台の処理
					if (this.h && (Math.random() * 99 | 0) == 1) {
						ttamaShoot(this.x, this.y);
					}
				}
			};

			//本体
			if (i == 0) {
				t.image_x = 0;
				t.image_w = 96;
				t.image_h = 96;
				t.bounds_w = 72;
				t.bounds_w = 72;
				t.amode = A_HARD;
				t.life = 20;
				t.core = true;
			}

			//相対座標設定
			else {
				if (i <= 6)	t.ry = -(i + 1) * t.image_h;
				else if (i <= 12)	t.rx = -(i - 5) * t.image_w;
				else if (i <= 18)	t.ry = (i - 11) * t.image_h;
				else				t.rx = (i - 17) * t.image_w;
				if (i % 6 == 0) t.h = true;
			}
			tekis.push(t);
		}
		this.cp = 0;
		this.rp = this.m[this.cp][0];
	},

	//敵移動処理
	move() {
		this.d = (this.d + 1) % 360;
		this.x += this.m[this.cp][1];
		this.y += this.m[this.cp][2];
		this.rp--;
		if (this.rp == 0) {
			this.cp++;
			if (this.cp == this.m.length) this.cp = 0;
			this.rp = this.m[this.cp][0];
		}
	},
	vanish() {
		if (tekis.length == 0) return;
		if (animcounter % 8 == 0) {
			var x = tekis[0].x;
			var y = tekis[0].y;
			tekis.shift();
			setBakuen(x, y);
		}
	}
};
var ttamas = [];
var items = [];

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
		laser.life = 0;
		shield.life = 0;
		tekis = [];
		ttamas = [];
		bakuens = [];
		hantens = [];
		items = [];
		mapnum = 0;
		worldx = -SCREEN_W;
		worldmax = mapdat[mapnum][0].length;
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
	if (laser.life > 0) laser.move();
	if (shield.life > 0) shield.move();
	if (worldx < worldmax * CHIP_W) {
		worldx += scspeed;
	}
	else if (worldx == worldmax * CHIP_W) {
		boss.init();
		worldx++;
	}
	else {
		boss.move();
	}
	for (var i = 0; i < tekis.length; i++) tekis[i].move();
	for (var i = 0; i < ttamas.length; i++) ttamas[i].move();
	for (var i = 0; i < items.length; i++) items[i].move();
	var a = atariHantei();
	if (a == 1 || mapAtari()) {
		gstate = GAME_OVER;
		starttime = Date.now();
		animcounter = 0;
		jbakuen.acounter = 16;
		backmusic.pause();
		playSound(clip1);
	}
	else if (a == 2) {
		gstate = GAME_CLEAR;
		starttime = Date.now();
		animcounter = 0;
		backmusic.pause();
	}

	drawGame(true);
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
	boss.vanish();
	for (var i = 0; i < tekis.length; i++) tekis[i].move();
	if (Date.now() - starttime >= 5000 || key_z_c == 1 || mouse_lbtn) {
		mapnum++;
		if (mapnum < mapdat.length) {
			gstate = GAME_MAIN;
			jichara.init();
			jitamas = [];
			laser.life = 0;
			shield.life = 0;
			tekis = [];
			ttamas = [];
			bakuens = [];
			hantens = [];
			items = [];
			worldx = -SCREEN_W;
			worldmax = mapdat[mapnum][0].length;
			animcounter = 0;
			openmusic.pause();
			playSound(backmusic);
		}
		else {
			gstate = GAME_TITLE;
			playSound(openmusic);
		}
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
			if (jt.life > 0) {
				var s = ctx.getTransform();
				ctx.translate(jt.x, jt.y);
				ctx.rotate(jt.d * Math.PI / 180);
				ctx.translate(-jt.x, -jt.y);
				ctx.drawImage(jt.img, jt.x - (jt.image_w >> 1), jt.y - (jt.image_h >> 1));
				ctx.setTransform(s);
			}
			else {
				jitamas.splice(i, 1);
				i--;
			}
		}

		if (laser.life > 0) {
			ctx.drawImage(laser.img, laser.x - (laser.image_w >> 1), laser.y - (laser.image_h >> 1));
		}
		if (shield.life > 0) {
			ctx.drawImage(shield.img, shield.x - (shield.image_w >> 1), shield.y - (shield.image_h >> 1));
		}
	}

	var dx = worldx / CHIP_W | 0;
	var shx = worldx % CHIP_W;
	for (var i = 0; i < 21; i++) {
		var x = i + dx;
		if (x < 0 || x >= worldmax) continue;
		for (var y = 0; y < 15; y++) {
			if (mapdat[mapnum][y][x] >= "A" && mapdat[mapnum][y][x] <= "Z") {
				var n = (mapdat[mapnum][y].charCodeAt(x) - "A".charCodeAt());
				sx = n % 8 * CHIP_W;
				sy = (n / 8 | 0) * CHIP_H;
				ctx.drawImage(mapbmp, sx, sy, CHIP_W, CHIP_H, i * CHIP_W - shx, y * CHIP_H, CHIP_W, CHIP_H);
			}
		}
	}

	dx = (worldx / CHIP_W | 0) + 20;
	if (dx >= 0 && dx < worldmax) {
		if (worldx + SCREEN_W == dx * CHIP_W) {
			for (var y = 0; y < 15; y++) {
				if (mapdat[mapnum][y][dx] >= "1" && mapdat[mapnum][y][dx] <= "9") {
					var n = (mapdat[mapnum][y].charCodeAt(x) - "1".charCodeAt());
					sx = n % 8 * CHIP_W * 2 + (animcounter / 8 | 0) % 2 * CHIP_W;
					sy = (n / 8 | 0) * CHIP_H;
					var t = {
						img: zakobmp,
						x: SCREEN_W + 16,
						y: y * CHIP_H + 16,
						animpat: 2,
						acounter: 0,
						aweight: 8,
						life: 1,
						image_x: sx,
						image_w: 32,
						image_h: 32,
						bounds_w: 24,
						bounds_h: 24,
						amode: A_NORMAL,
						bakuen: true,
						n: n,
						cp: 0,
						rp: zakopat[n][0][0],
						item: (Math.random() * 2 | 0),
						move() {
							var dx = zakopat[this.n][this.cp][1];
							var dy = zakopat[this.n][this.cp][2];
							if (dx >= 100) {
								var d = Math.atan2(jichara.y - this.y, jichara.x - this.x);
								var s = dx / 100 | 0;
								dx = Math.cos(d) * s;
								dy = Math.sin(d) * s;
							}
							this.x += dx;
							this.y += dy;
							this.rp--;
							if (this.rp <= 0) {
								this.cp = (this.cp + 1) % zakopat[this.n].length;
								this.rp = zakopat[this.n][this.cp][0];
							}
							if ((Math.random() * 99 | 0) == 1) {
								ttamaShoot(this.x, this.y);
							}
						}
					}
					tekis.push(t);
				}
			}
		}
	}

	for (var i = 0; i < tekis.length; i++) {
		var t = tekis[i];
		if (t.life > 0) {
			sx = t.image_x + (t.acounter / t.aweight | 0) % t.animpat * t.image_w;
			var d = 0;
			var s = ctx.getTransform();
			ctx.translate(t.x, t.y);
			ctx.rotate(d);
			ctx.translate(-t.x, -t.y);
			ctx.drawImage(t.img, sx, 0, t.image_w, t.image_h, t.x - (t.image_w >> 1), t.y - (t.image_h >> 1), t.image_w, t.image_h);
			ctx.setTransform(s);
			t.acounter++;
		}
		else {
			tekis.splice(i, 1);
			i--;
		}
	}

	if (tama) {
		for (var i = 0; i < ttamas.length; i++) {
			var tt = ttamas[i];
			if (tt.life > 0) {
				sx = tt.image_x;
				ctx.drawImage(tt.img, sx, 0, tt.image_w, tt.image_h, tt.x - (tt.image_w >> 1), tt.y - (tt.image_h >> 1), tt.image_w, tt.image_h);
			}
			else {
				ttamas.splice(i, 1);
				i--;
			}
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

	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.life > 0) {
			sx = item.image_x;
			ctx.drawImage(item.img, sx, 0, item.image_w, item.image_h, item.x - (item.image_w >> 1), item.y - (item.image_h >> 1), item.image_w, item.image_h);
		}
		else {
			items.splice(i, 1);
			i--;
		}
	}

	ctx.fillStyle = "#fff";
	ctx.font = "32px 'Mkana+'";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.fillText(`ライフ = ${jichara.life}`, 0, SCREEN_H - 64);
	ctx.fillText(`弾の間隔 = ${jichara.tweight}`, 0, SCREEN_H - 32);
	ctx.fillText(`レーザー = ${jichara.laser}`, 0, SCREEN_H);
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
			if (a.life > 0) setHanten(a.x, a.y, a.image_w, a.image_h);
			break;
		case A_MORTAL:	//音を鳴らす
			playSound(clip7);
			break;
		}
		if (a.life == 0 && a.bakuen) setBakuen(a.x, a.y);
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
		if (b.life == 0 && b.bakuen) setBakuen(b.x, b.y);
		retval = true;
	}
	return retval;
}

function atariHantei() {
	for (var i = 0; i < tekis.length; i++) {
		var t = tekis[i];
		if (t.life > 0 && t.amode != A_GHOST) {
			//自機と敵の判定
			isAtari(jichara, t);
			//弾と敵の判定
			for (var j = 0; j < jitamas.length; j++) {
				var jt = jitamas[j];
				if (jt.life > 0) isAtari(jt, t);
			}
			//レーザーと敵の判定
			if (laser.life > 0) isAtari(laser, t);
			//シールドと敵の判定
			if (shield.life > 0) isAtari(shield, t);

			if (t.life == 0) {
				//ゲームクリア
				if (t.core) return 2;

				//アイテムの設置
				if (t.item == 1) setItem(t.x, t.y, Math.random() * 5 | 0);
			}
		}
	}
	for (var i = 0; i < ttamas.length; i++) {
		var tt = ttamas[i];
		if (tt.life > 0 && tt.amode != A_GHOST) {
			//自機と敵弾の判定
			isAtari(jichara, tt);
			//シールドと敵の判定
			if (shield.life > 0) isAtari(shield, tt);
		}
	}
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.life > 0 && item.amode != A_GHOST) {
			//自機とアイテムの判定
			if (isAtari(jichara, item)) {
				switch (item.type) {
				//弾の間隔
				case 0:
					if (jichara.tweight > 0) jichara.tweight--;
					break;
				//ライフ
				case 1:
					jichara.life++;
					break;
				//3方向
				case 2:
					if (jichara.t_way == 0) {
						jichara.t_way = 1;
					}
					else {

					}
					break;
				//レーザー
				case 3:
					jichara.laser = 600;
					break;
				//シールド
				case 4:
					shield.life = 3;
					shield.x = jichara.x + (jichara.image_w >> 1);
					shield.y = jichara.y;
					break;
				}
				item.life = 0;
				playSound(clip4);
			}
		}
	}
	if (jichara.life == 0) return 1;
	return 0;
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

//●砲台から弾を発射（hx、hyは砲台の座標）
function ttamaShoot(hx, hy) {
	var d = Math.atan2(jichara.y - hy, jichara.x - hx);
	var tt = {
		img: ttamabmp,
		animpat: 1,
		acounter: 0,
		aweight: 1,
		x: hx,
		y: hy,
		life: 1,
		image_x: 0,
		image_w: 12,
		image_h: 12,
		bounds_w: 8,
		bounds_h: 8,
		amode: A_NORMAL,
		sx: Math.cos(d),
		sy: Math.sin(d),
		s: 4,
		move() {
			//弾の移動
			this.x += this.sx * this.s;
			this.y += this.sy * this.s;

			//画面外に出たときの処理
			if (this.x < -6 || this.y < -6 || this.x > 646 || this.y > 486) this.life = 0;
		}
	};
	ttamas.push(tt);
	playSound(clip3);
}

//●砲台から弾を発射2（hx、hyは砲台の座標、hdegは発射方向）
function ttamaShoot2(hx, hy, hdeg) {
	var tt = {
		img: ttamabmp,
		animpat: 1,
		acounter: 0,
		aweight: 1,
		x: hx,
		y: hy,
		life: 1,
		image_x: 12,
		image_w: 12,
		image_h: 12,
		bounds_w: 8,
		bounds_h: 8,
		amode: A_NORMAL,
		sx: Math.sin(hdeg * Math.PI / 180),
		sy: -Math.cos(hdeg * Math.PI / 180),
		s: 8,
		move() {
			//弾の移動
			this.x += this.sx * this.s;
			this.y += this.sy * this.s;

			//画面外に出たときの処理
			if (this.x < -6 || this.y < -6 || this.x > 646 || this.y > 486) this.life = 0;
		}
	};
	ttamas.push(tt);
}

//●自キャラとマップの当たり判定
function mapAtari() {
	var x1 = (worldx + jichara.x - (jichara.bounds_w >> 1)) / CHIP_W | 0;
	var y1 = (jichara.y - (jichara.bounds_h >> 1)) / CHIP_H | 0;
	var x2 = (worldx + jichara.x + (jichara.bounds_w >> 1)) / CHIP_W | 0;
	var y2 = (jichara.y + (jichara.bounds_h >> 1)) / CHIP_H | 0;

	if (x1 >= 0 && x1 < worldmax) {
		if (mapdat[mapnum][y1][x1] >= "A" && mapdat[mapnum][y1][x1] <= "Z") return true;
	}
	if (x2 >= 0 && x2 < worldmax) {
		if (mapdat[mapnum][y2][x2] >= "A" && mapdat[mapnum][y2][x2] <= "Z") return true;
	}
	return false;
}

//●アイテムのセット
function setItem(x, y, t) {
	var item = {
		img: itembmp,
		animpat: 1,
		acounter: 0,
		aweight: 1,
		x: x,
		y: y,
		life: 1,
		image_x: t * 16,
		image_w: 16,
		image_h: 16,
		bounds_w: 12,
		bounds_h: 12,
		amode: A_SOFT,
		type: t,
		move() {
			this.x -= 2;
			if (this.x < -(this.image_w >> 1)) this.life = 0;
		}
	}
	items.push(item);
}