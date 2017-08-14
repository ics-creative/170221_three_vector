'use strict';

(function() {
  // シーン
  var scene = new THREE.Scene();

  // カメラ
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

  // レンダラー
  var renderer = new THREE.WebGLRenderer({antialias: false});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1);
  document.body.appendChild(renderer.domElement);

  var degree = 0; // 角度
  var radius = 150; // 半径
  var frontVector = new THREE.Vector3(0, -1, 0);

  // 球
  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(10),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
  );
  scene.add(sphere);

  // ヘルパー
  var helper = new THREE.ArrowHelper(
    frontVector,
    new THREE.Vector3(0, 0, 0),
    40
  );
  sphere.add(helper);

  // 地球
  var earth = new THREE.Mesh(
    new THREE.SphereGeometry(70),
    new THREE.MeshBasicMaterial({ color: 0x9999ff, wireframe: true })
  );
  scene.add(earth);

  // 地面
  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000, 50, 50),
    new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true })
  );
  plane.rotation.x = 90 * Math.PI / 180;
  plane.position.y = -80;
  scene.add(plane);

  // フレーム毎のレンダーを登録
  tick();
  function tick() {
    requestAnimationFrame(tick);

    // 球を回転させる
    degree -= 2;

    // 現在の位置を保持しておく
    var oldPosition = sphere.position.clone();
    // アニメーション後の新しい位置を取得
    var newPosition = getCircularMotionPosition(degree);
    // oldPostion - newPositionで進んでいる方向のベクトルを算出
    frontVector = newPosition.clone().sub(oldPosition);
    // 単位ベクトルに変換
    frontVector = frontVector.normalize();

    // 正面ベクトルに対して逆向きのベクトル
    var backVector = frontVector.clone().negate();
    // 球とカメラの距離
    var distance = 200;
    // 逆向きベクトルを距離分引き伸ばす
    backVector.multiplyScalar(distance);

    // カメラ位置を算出
    var cameraPosition = backVector.add(sphere.position);
    camera.position.copy(cameraPosition);

    // カメラを球に向かせる
    camera.lookAt(sphere.position);

    // 球の位置を更新
    sphere.position.copy(newPosition);

    // ヘルパーの向きを更新
    helper.setDirection(frontVector);

    renderer.render(scene, camera);
  }

  // 角度を渡して円運動の位置を返却します
  function getCircularMotionPosition(deg) {
    // 角度をラジアンに変換します
    var rad = deg * Math.PI / 180;
    // X座標 = 半径 x Cosθ
    var x = radius * Math.cos(rad);
    // Y座標
    var y = radius * Math.sin(rad * 1.5) / 7;
    // Z座標 = 半径 x Sinθ
    var z = radius * Math.sin(rad);

    return new THREE.Vector3(x, y, z);
  }
})();

