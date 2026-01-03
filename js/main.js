// GLOBAL VARIABLE
// UPGRADE
let maxInventory = 100;
let fishPerCatch = 10;

// Fishing speed (milliseconds)
let fishingSpeed = 5000; // 5 seconds per catch
const MIN_FISHING_SPEED = 500;

// Boat speed
let boatSpeed = 0.1;

// Upgrade costs
let inventoryUpgradeCost = 100;
let fishingSpeedUpgradeCost = 150;
let boatSpeedUpgradeCost = 300;
let researchUpgradeCost = 200;

//fishing
let isFishing = false;
let fishInventory = 0;
let fishingInterval = null;

//fishing zone 
let fishingZone;
let zoneOpacity = 0.7;
let zoneTimer = 0;

const ZONE_LIFETIME = 10000; // 10 seconds
const MIN_ZONE_OPACITY = 0.15;

//sell
let money = 0;
let canSell = false;
let sellZone;

let factoryBox = new THREE.Box3();
const clock = new THREE.Clock();

// UI
const moneyEl = document.getElementById("money");
const zoneStatusEl = document.getElementById("zoneStatus");
const fishCountEl = document.getElementById("fishCount");
const moneyUI = document.getElementById("moneyUI");

const fishBtn = document.getElementById("fishBtn");
const sellBtn = document.getElementById("sellBtn");

const invBtn = document.getElementById("invBtn");
const speedBtn = document.getElementById("speedBtn");
const boatBtn = document.getElementById("boatBtn");
const researchBtn = document.getElementById("researchBtn");

const invCostUI = document.getElementById("invCost");
const speedCostUI = document.getElementById("speedCost");
const boatCostUI = document.getElementById("boatCost");
const researchCostUI = document.getElementById("researchCost");

function updateUpgradeUI() {
    moneyUI.textContent = `$${money}`;

    invCostUI.textContent = inventoryUpgradeCost;
    speedCostUI.textContent = fishingSpeedUpgradeCost;
    boatCostUI.textContent = boatSpeedUpgradeCost;
    researchCostUI.textContent = researchUpgradeCost;

    invBtn.disabled = money < inventoryUpgradeCost;
    speedBtn.disabled = money < fishingSpeedUpgradeCost;
    boatBtn.disabled = money < boatSpeedUpgradeCost;
    researchBtn.disabled = money < researchUpgradeCost;
}

function spawnFishText(amount) {
    const div = document.createElement("div");
    div.className = "floating-text fish-text";
    div.textContent = `+${amount} Fish`;

    document.body.appendChild(div);

    updateFloatingTextPosition(div, 2);

    setTimeout(() => div.remove(), 1000);
}

function spawnMoneyText(amount) {
    const div = document.createElement("div");
    div.className = "floating-text money-text";

    if (amount >= 0) {
        div.textContent = `+$${amount}`;
        div.style.color = "#00e676"; // green
    } else {
        div.textContent = `-$${Math.abs(amount)}`;
        div.style.color = "#ff5252"; // red
    }

    document.body.appendChild(div);

    updateFloatingTextPosition(div, 3); // higher than fish

    setTimeout(() => div.remove(), 1200);
}

function updateFloatingTextPosition(div, heightOffset) {
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();

    const pos = boat.getWorldPosition(new THREE.Vector3());
    pos.y += heightOffset;

    pos.project(camera);

    const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;

    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
}

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Camera
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 18, 18);
camera.lookAt(0, 0, 0);
camera.rotation.order = "YXZ";

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ambient light (soft)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Directional light (shadows / depth)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// Oceon
const oceanGeo = new THREE.PlaneGeometry(50, 50);
const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x1e88e5,
    transparent: true,
    opacity: 0.9
});

const ocean = new THREE.Mesh(oceanGeo, oceanMat);
ocean.rotation.x = -Math.PI / 2; // flat
ocean.position.y = 0;
scene.add(ocean);

const OCEAN_LIMIT = 20; // playable area size

// Boat
function createCustomBoat() {
    const boat = new THREE.Group();

    const woodMat = new THREE.MeshStandardMaterial({
        color: 0x8d6e63
    });

    // Bottom base
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.6, 3),
        woodMat
    );
    base.position.y = 0.2;
    boat.add(base);

    // Left side
    const leftSide = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.6, 3),
        woodMat
    );
    leftSide.position.set(-1, 0.6, 0);
    boat.add(leftSide);

    // Right side
    const rightSide = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.6, 3),
        woodMat
    );
    rightSide.position.set(1, 0.6, 0);
    boat.add(rightSide);

    // Front side
    const frontSide = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.6, 0.3),
        woodMat
    );
    frontSide.position.set(0, 0.6, 1.5);
    boat.add(frontSide);

    // Back side
    const backSide = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.6, 0.3),
        woodMat
    );
    backSide.position.set(0, 0.6, -1.5);
    boat.add(backSide);

    // Rotate so forward is correct
    boat.rotation.y = Math.PI / 2;

    // Float height
    boat.position.y = 0.5;

    return boat;
}
const boat = createCustomBoat();
scene.add(boat);

// Buoy
const buoyGeo = new THREE.CylinderGeometry(0.2, 0.3, 1, 16);
const buoyMat = new THREE.MeshStandardMaterial({ color: 0xff3d00 });

const buoys = [];

function createBuoy(x, y, z) {
    const buoy = new THREE.Mesh(buoyGeo, buoyMat);
    buoy.position.set(x, 0.5, z);
    scene.add(buoy);
    buoys.push(buoy);
}

for (let i = -OCEAN_LIMIT; i <= OCEAN_LIMIT; i += 2) {
    // Top & Bottom
    createBuoy(i, 0, -OCEAN_LIMIT);
    createBuoy(i, 0, OCEAN_LIMIT);

    // Left & Right
    createBuoy(-OCEAN_LIMIT, 0, i);
    createBuoy(OCEAN_LIMIT, 0, i);
}

// Factory
function createFactory() {
    const factory = new THREE.Group();

    // Main building
    const bodyGeo = new THREE.BoxGeometry(6, 3, 6); //original 6,3,6
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 1.5, 0); //x,y,z
    factory.add(body);

    // Roof
    const roofGeo = new THREE.BoxGeometry(6.5, 1, 6.5);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 3.5, 0); //x,y,z
    factory.add(roof);

    // Chimney
    const chimneyGeo = new THREE.CylinderGeometry(0.5, 0.5, 4);
    const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
    chimney.position.set(2, 3.5, 2); //x,y,z
    factory.add(chimney);

    // Position factory on ocean
    factory.position.set(16.5, 0, -16);
    scene.add(factory);

    return factory;
}

const factory = createFactory();
factoryBox.setFromObject(factory);

function checkFactoryCollision() {
    const boatBox = new THREE.Box3().setFromObject(boat);

    if (boatBox.intersectsBox(factoryBox)) {
        return true;
    }
    return false;
}

sellZone = createSellZone(
    factory.position.x,
    factory.position.z + 4
);

function createSellZone(x, z) {
    const geo = new THREE.CircleGeometry(2.5, 32);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xffd54f,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });

    const zone = new THREE.Mesh(geo, mat);
    zone.rotation.x = -Math.PI / 2;
    zone.position.set(x, 0.05, z);
    scene.add(zone);

    return zone;
}

function isBoatInSellZone() {
    const dx = boat.position.x - sellZone.position.x;
    const dz = boat.position.z - sellZone.position.z;
    return Math.sqrt(dx * dx + dz * dz) < 2.5;
}


// Fishing Zone
function createFishingZone() {
    const geo = new THREE.CircleGeometry(2, 32);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: zoneOpacity,
        side: THREE.DoubleSide
    });

    const zone = new THREE.Mesh(geo, mat);
    zone.rotation.x = -Math.PI / 2;
    zone.position.y = 0.05;

    scene.add(zone);
    moveFishingZone(zone);

    return zone;
}

function moveFishingZone(zone) {
    const margin = 4;

    zone.position.x = THREE.MathUtils.randFloat(
        -OCEAN_LIMIT + margin,
        OCEAN_LIMIT - margin
    );

    zone.position.z = THREE.MathUtils.randFloat(
        -OCEAN_LIMIT + margin,
        OCEAN_LIMIT - margin
    );

    zoneTimer = 0;
    zoneOpacity = 0.7;
    zone.material.opacity = zoneOpacity;

    if (isFishing) stopFishing();
}


fishingZone = createFishingZone();

function isBoatInFishingZone() {
    const dx = boat.position.x - fishingZone.position.x;
    const dz = boat.position.z - fishingZone.position.z;
    return Math.sqrt(dx * dx + dz * dz) < 2;
}


//Fishing
function startFishing() {
    isFishing = true;

    fishingInterval = setInterval(() => {

        if (fishInventory >= maxInventory) {
            stopFishing();
            return;
        }

        fishInventory += fishPerCatch;

        if (fishInventory > maxInventory) {
            fishInventory = maxInventory;
        }

        spawnFishText(fishPerCatch);
        console.log("Fish:", fishInventory);

    }, fishingSpeed);
}


function stopFishing() {
    isFishing = false;
    clearInterval(fishingInterval);
    fishingInterval = null;
}

function toggleFishing() {
    if (!isFishing) {
        startFishing();
    } else {
        stopFishing();
    }
}

//Sell
function sellFish() {
    if (fishInventory <= 0) return;

    const earned = fishInventory * 2;
    money += earned;
    fishInventory = 0;

    spawnMoneyText(earned);
    console.log("Money:", money);
}

//Upgrade
function upgradeBoatSpeed() {
    if (money >= boatSpeedUpgradeCost) {
        money -= boatSpeedUpgradeCost;
        spawnMoneyText(-boatSpeedUpgradeCost);

        boatSpeed += 0.02;
        boatSpeedUpgradeCost += 300;
    }
}

function upgradeInventory() {
    if (money >= inventoryUpgradeCost) {
        money -= inventoryUpgradeCost;
        spawnMoneyText(-inventoryUpgradeCost);

        maxInventory += 100;
        inventoryUpgradeCost += 100;
    }
}

function upgradeFishingSpeed() {
    if (money >= fishingSpeedUpgradeCost && fishingSpeed > MIN_FISHING_SPEED) {
        money -= fishingSpeedUpgradeCost;
        spawnMoneyText(-fishingSpeedUpgradeCost);

        fishingSpeed -= 1000; // 1 sec faster
        fishingSpeedUpgradeCost += 150;

        if (isFishing) {
            stopFishing();
            startFishing();
        }
    }
}

function upgradeFishResearch() {
    if (money >= researchUpgradeCost) {
        money -= researchUpgradeCost;
        spawnMoneyText(-researchUpgradeCost);

        fishPerCatch += 10;
        researchUpgradeCost += 200;
    }
}

//Controls
const keys = {};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "f" && canFish) {
        toggleFishing();
    }
});
window.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "e" && canSell) {
        sellFish();
    }
});
window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "u") {
        upgradeFishingSpeed();
    }
});

fishBtn.addEventListener("click", () => {
    if (!canFish) return;

    toggleFishing();
});

sellBtn.addEventListener("click", () => {
    if (!canSell) return;

    sellFish();
});

invBtn.onclick = upgradeInventory;
speedBtn.onclick = upgradeFishingSpeed;
boatBtn.onclick = upgradeBoatSpeed;
researchBtn.onclick = upgradeFishResearch;

window.addEventListener("keydown", (e) => {
    if (e.key === "1") upgradeInventory();
    if (e.key === "2") upgradeFishingSpeed();
    if (e.key === "3") upgradeBoatSpeed();
    if (e.key === "4") upgradeFishResearch();
});


//animation variable
let floatTime = 0;
let buoyTime = 0;
let canFish = false;

//render
function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta() * 1000; // ms

    //buoy
    buoyTime += 0.03;
    buoys.forEach((b, i) => {
        b.position.y = 0.4 + Math.sin(buoyTime + i) * 0.1;
    });

    //boat
    floatTime += 0.05;
    boat.position.y = 0.5 + Math.sin(floatTime) * 0.1; // floating effect

    const prevX = boat.position.x;
    const prevZ = boat.position.z;

    const speed = boatSpeed;

    let moving = false;

    // Forward (Up / W)
    if (keys["arrowup"] || keys["w"]) {
        boat.position.z -= speed;
        boat.rotation.y = Math.PI;
        moving = true;
    }

    // Backward (Down / S)
    if (keys["arrowdown"] || keys["s"]) {
        boat.position.z += speed;
        boat.rotation.y = 0;
        moving = true;
    }

    // Left (Left / A)
    if (keys["arrowleft"] || keys["a"]) {
        boat.position.x -= speed;
        boat.rotation.y = Math.PI / 2;
        moving = true;
    }

    // Right (Right / D)
    if (keys["arrowright"] || keys["d"]) {
        boat.position.x += speed;
        boat.rotation.y = -Math.PI / 2;
        moving = true;
    }

    //limit boat
    boat.position.x = THREE.MathUtils.clamp(
        boat.position.x,
        -OCEAN_LIMIT + 1,
        OCEAN_LIMIT - 1
    );

    boat.position.z = THREE.MathUtils.clamp(
        boat.position.z,
        -OCEAN_LIMIT + 1,
        OCEAN_LIMIT - 1
    );

    // ---- Fishing Zone Timer ----
    zoneTimer += deltaTime;

    zoneOpacity = THREE.MathUtils.lerp(
        0.7,
        MIN_ZONE_OPACITY,
        zoneTimer / ZONE_LIFETIME
    );

    fishingZone.material.opacity = canFish
        ? Math.min(zoneOpacity + 0.2, 0.9)
        : zoneOpacity;

    if (zoneTimer >= ZONE_LIFETIME) {
        moveFishingZone(fishingZone);
    }

    canFish = isBoatInFishingZone();

    // Auto stop fishing
    if (isFishing && !canFish) {
        stopFishing();
    }

    //factory zone
    canSell = isBoatInSellZone();
    sellZone.material.opacity = canSell ? 0.7 : 0.4;

    // FISHING UI
    if (canFish) {
        fishBtn.classList.remove("hidden");
        sellBtn.classList.add("hidden");

        if (isFishing) {
            fishBtn.textContent = "🛑 Stop Fishing";
            fishBtn.classList.remove("start");
            fishBtn.classList.add("stop");
        } else {
            fishBtn.textContent = "🎣 Start Fishing";
            fishBtn.classList.remove("stop");
            fishBtn.classList.add("start");
        }
    } else {
        fishBtn.classList.add("hidden");
    }

    // SELL UI
    if (canSell) {
        sellBtn.classList.remove("hidden");
        fishBtn.classList.add("hidden");
    } else {
        sellBtn.classList.add("hidden");
    }

    // UI
    zoneStatusEl.textContent = canFish ? "YES" : "NO";
    zoneStatusEl.style.color = canFish ? "#00ffcc" : "#ff5252";

    fishCountEl.textContent = `${fishInventory} / ${maxInventory}`;
    moneyEl.textContent = `$${money}`;


    // camera follow (square aligned)
    camera.position.x = boat.position.x;   // follow X only
    camera.position.y = 18;                // fixed height
    camera.position.z = boat.position.z + 18; // straight back, not diagonal

    camera.lookAt(
        boat.position.x,
        0,
        boat.position.z
    );

    updateUpgradeUI();

    renderer.render(scene, camera);
}

animate();
