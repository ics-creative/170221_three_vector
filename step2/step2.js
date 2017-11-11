// シーン
const scene = new THREE.Scene();

// カメラ
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#myCanvas'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

let degree = 0; // 角度
const radius = 150; // 半径
let frontVector = new THREE.Vector3(0, -1, 0);

// 球
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(10),
  new THREE.MeshBasicMaterial({color: 0xCC0000, wireframe: true}),
);
scene.add(sphere);

// ヘルパー
const helper = new THREE.ArrowHelper(
  frontVector,
  new THREE.Vector3(0, 0, 0),
  40,
);
sphere.add(helper);

// 地球
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(70),
  new THREE.MeshBasicMaterial({color: 0x888888, wireframe: true}),
);
scene.add(earth);

// 地面
const plane = new THREE.GridHelper(1000, 20);
plane.position.y = -80;
scene.add(plane);

// フレーム毎のレンダーを登録
tick();

function tick() {
  requestAnimationFrame(tick);

  // 球を回転させる
  degree -= 2;

  // 現在の位置を保持しておく
  const oldPosition = sphere.position.clone();
  // アニメーション後の新しい位置を取得
  const newPosition = getCircularMotionPosition(degree);
  // oldPostion - newPositionで進んでいる方向のベクトルを算出
  frontVector = newPosition.clone().sub(oldPosition);
  // 単位ベクトルに変換
  frontVector = frontVector.normalize();

  // 正面ベクトルに対して逆向きのベクトル
  const backVector = frontVector.clone().negate();
  // 球とカメラの距離
  const distance = 200;
  // 逆向きベクトルを距離分引き伸ばす
  backVector.multiplyScalar(distance);

  // カメラ位置を算出
  const cameraPosition = backVector.add(sphere.position);
  camera.position.copy(cameraPosition);

  // カメラを球に向かせる
  camera.lookAt(sphere.position);

  // 球の位置を更新
  sphere.position.copy(newPosition);

  // ヘルパーの向きを更新
  helper.setDirection(frontVector);

  renderer.render(scene, camera);
}

/**
 * 角度を渡して円運動の位置を返却します
 * @param {Number} degree 角度です。
 * @returns {THREE.Vector3}
 */
function getCircularMotionPosition(degree) {
  // 角度をラジアンに変換します
  const rad = degree * Math.PI / 180;
  // X座標 = 半径 x Cosθ
  const x = radius * Math.cos(rad);
  // Y座標
  const y = radius * Math.sin(rad * 1.5) / 7;
  // Z座標 = 半径 x Sinθ
  const z = radius * Math.sin(rad);

  return new THREE.Vector3(x, y, z);
}
