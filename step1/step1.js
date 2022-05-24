// シーン
const scene = new THREE.Scene();

// カメラ
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 0, -400);
camera.lookAt(new THREE.Vector3(0, 0, 0));

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
    new THREE.SphereGeometry(70, 20, 20),
    new THREE.MeshBasicMaterial({color: 0x666666, wireframe: true}),
);
scene.add(earth);

// 地面
const plane = new THREE.GridHelper(1000, 20);
plane.position.y = -80;
scene.add(plane);

// ️アニメーション時間（ミリ秒）
const duration = 1000;

// アニメーションの開始時間を格納する変数
const startTime= Date.now();

// フレーム毎のレンダーを登録
// ※リフレッシュレートには依存しない
tick();

function tick() {
    requestAnimationFrame(tick);

    // 現在時間の継続時間に対する進捗度を算出
    const progress = (Date.now() - startTime) / duration;

    // 球を回転させる
    // 1秒(duration秒)で-120度回転する
    degree = -120 * progress;

    // 現在の位置を保持しておく
    const oldPosition = sphere.position.clone();
    // アニメーション後の新しい位置を取得
    const newPosition = getCircularMotionPosition(degree);
    // oldPosition - newPositionで進んでいる方向のベクトルを算出
    frontVector = newPosition.clone().sub(oldPosition);
    // 単位ベクトルに変換
    frontVector = frontVector.normalize();

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


// リサイズ時の処理
window.addEventListener('resize', () => {
    // カメラのアスペクト比を更新
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // レンダラーのサイズを更新
    renderer.setSize(window.innerWidth, window.innerHeight);
});