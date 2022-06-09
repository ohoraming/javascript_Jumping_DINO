// 기본 세팅
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;
// 기본 세팅

// 네모 그리기
// ctx.fillStyle = 'green';
// ctx.fillRect(10, 10, 100, 100);

// 이미지
let img1 = new Image(50, 50,);
img1.src = 'dino.png'; // 캐릭터
let img2 = new Image();
img2.src = 'cactus.png'; // 장애물


// 등장 캐릭터의 속성부터 object자료에 정리해두면 편리함
// 캐릭터 등장 좌표
const dino = {
	x: 40,
	y: 350,
	width: 70,
	height: 150,
	draw() {
		ctx.fillStyle = "green";
		// ctx.fillRect(this.x, this.y, this.width, this.height); // x,y 지점에 이 사이즈로 네모 그리기(hitbox)
    ctx.drawImage(img1, this.x-30, this.y-5, img1.width*3, img1.height*3) // 이미지
	},
};
dino.draw(); // 등장시키고 싶을 때 호출

// 장애물
class Cactus {
	constructor() {
		this.x = 1100;
		this.y = 400;
		this.width = 60;
		this.height = 100;
	}
	draw() {
		ctx.fillStyle = "red";
		// ctx.fillRect(this.x, this.y, this.width, this.height); // x,y 지점에 이 사이즈로 그리기(hitbox)
    ctx.drawImage(img2, this.x-20, this.y, img2.width*0.2, img2.height*0.2); // 이미지
	}
}

// 애니메이션 만들기
// 게임세상은 frame으로 움직임
// 모니터 FPS에 따라 실행횟수 다름
let timer = 0;
let cactuses = [];
let jumping = false; // 일종의 스위치
let jumptimer = 0;
let animation;
let score = 0;

function execPerFrame() {
  animation = requestAnimationFrame(execPerFrame);
	timer+=3; // frame마다 1씩 증가

	// frame마다 실행시킬 내용
	ctx.clearRect(0, 0, canvas.width, canvas.height); // 잔상 지우기

	// 장애물 그리기
	// frame마다 한번씩 생김
	if (timer % 400 === 0) {
		// 하나만 그릴 때
		// let cactus = new Cactus();
		// cactus.draw();

		// 여러 개 그릴 때
		let cactus = new Cactus();
		cactuses.push(cactus); // 생성시마다 배열에 추가하기
	}
	// 배열에 있던 것을 한번에 그림
	cactuses.forEach((a, i, o) => {
		// x좌표가 0미만이면 배열에서 제거
		if (a.x < 0) {
			o.splice(i, 1);
			score += 10; // 장애물이 끝으로 가서 사라질 때 점수 올라감
		}
		a.x-=6;

    // 캐릭터와 모든 장애물의 충돌을 체크
    isCollision(dino, a);

		a.draw();
	});

	const score = document.querySerlector('#score');
	

	dino.draw();

  // 점프 기능
	if (jumping == true) {
		dino.y-=13; // 캐릭터 올라감(숫자로 점프 속도 조절)
		jumptimer++; // frame마다 timer증가
    if (dino.y == 0) { // 캐릭터가 화면 상단끝에 닿으면
      dino.y+=13; // 내려옴
    }
	}
	if (jumping == false) { // key up되면 
    if (dino.y < 350) { // 이 높이보다 낮으면
      dino.y+=9; // 캐릭터 내려감
    }
	}
	if (jumptimer > 25) {
		// 일정 시간 지나면
		jumping = false; // 점핑 중단
    jumptimer = 0; // timer 리셋
	}
}

execPerFrame();

// 충돌 체크(collision check(detection))
function isCollision(dino, cactus) {
  let xDiff = cactus.x - (dino.x + dino.width); 
  let yDiff = cactus.y - (dino.y + dino.height);
  if(xDiff < 0 && yDiff < 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 잔상 지우기
    cancelAnimationFrame(animation);
  } 
}

// space bar 누르면 캐릭터 점프
document.addEventListener("keydown", (e) => {
	if (e.code === "Space") {
		jumping = true;
	}
});
