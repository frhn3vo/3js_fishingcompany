// GLOBAL VARIABLE
// VISUAL: Wake Particles
const wakes = [];
const wakeGeo = new THREE.PlaneGeometry(0.5, 0.5);
const wakeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

// UPGRADE
let maxInventory = 100;
let fishPerCatch = 10;
let fishingSpeed = 3000; // 5 seconds per catch
let boatSpeed = 0.1;// Boat speed

// Upgrade Level
let invLevel = 1;
let speedLevel = 1;
let boatLevel = 1;
let researchLevel = 1;

// NEW: Game Levels & Quota
let gameLevel = 1;
let totalFishCaught = 0; // Total fish caught in THIS level
let levelGoal = 500; // Catch 500 fish to beat level 1

// Upgrade Limit
const MAX_INVENTORY = 5000;
const MAX_BOAT_SPEED = 0.35;
const MAX_FISH_PER_CATCH = 30;
const MIN_FISHING_SPEED = 1000;

// Upgrade costs
let inventoryUpgradeCost = 100;
let fishingSpeedUpgradeCost = 200;
let boatSpeedUpgradeCost = 300;
let researchUpgradeCost = 500;

// Fishing
let isFishing = false;
let fishInventory = 0;
let fishingInterval = null;

// Fishing zones
let fishingZones = [];
const ZONE_LIFETIME = 10000; // 10 seconds
const MIN_ZONE_OPACITY = 0.15;
const ZONE_COUNT = 3;

// Sell & Quota Zones
let money = 0;
let canSell = false;
let canCompleteLevel = false;
let sellZone;
let quotaZone;
let houseMesh; // Reference to the house

let factoryBox = new THREE.Box3();
const clock = new THREE.Clock();

// Pre-create textures and materials

// Quota Platform Texture
const warningCanvas = document.createElement('canvas');
warningCanvas.width = 64; warningCanvas.height = 64;
const wCtx = warningCanvas.getContext('2d');
wCtx.fillStyle = '#ffea00';
wCtx.fillRect(0, 0, 64, 64);
wCtx.fillStyle = '#000000';
wCtx.beginPath();
wCtx.moveTo(0, 0); wCtx.lineTo(32, 0); wCtx.lineTo(0, 32); wCtx.fill();
wCtx.beginPath();
wCtx.moveTo(64, 64); wCtx.lineTo(32, 64); wCtx.lineTo(64, 32); wCtx.fill();

const warningTexture = new THREE.CanvasTexture(warningCanvas);
warningTexture.magFilter = THREE.NearestFilter;
const quotaPlatMat = new THREE.MeshStandardMaterial({ map: warningTexture });

// House Materials
const houseBodyMat = new THREE.MeshStandardMaterial({ color: 0xD2691E }); // Wood/Brick
const houseRoofMat = new THREE.MeshStandardMaterial({ color: 0x8B0000 }); // Red roof
const lighthouseBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White tower
const lighthouseTopMat = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark top
const lightBulbMat = new THREE.MeshBasicMaterial({ color: 0xffffaa }); // Bulb

// UI Helpers
function setUpgradeCost(costEl, isMax, costValue) {
    if (isMax) {
        costEl.textContent = "MAX";
    } else {
        costEl.textContent = costValue;
    }
}

// DOM Elements
const moneyEl = document.getElementById("money");
const zoneStatusEl = document.getElementById("zoneStatus");
const fishCountEl = document.getElementById("fishCount");
const moneyUI = document.getElementById("moneyUI");

// NEW: Quota DOM Elements
const gameLevelEl = document.getElementById("gameLevel");
const quotaProgressEl = document.getElementById("quotaProgress");
const quotaGoalEl = document.getElementById("quotaGoal");
const quotaBtn = document.getElementById("quotaBtn");
const winScreen = document.getElementById("winScreen");
const restartBtn = document.getElementById("restartBtn");

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

const invLevelEl = document.getElementById("invLevel");
const speedLevelEl = document.getElementById("speedLevel");
const boatLevelEl = document.getElementById("boatLevel");
const researchLevelEl = document.getElementById("researchLevel");

const invMaxLabel = invBtn.querySelector(".max-label");
const speedMaxLabel = speedBtn.querySelector(".max-label");
const boatMaxLabel = boatBtn.querySelector(".max-label");
const researchMaxLabel = researchBtn.querySelector(".max-label");


function updateUpgradeUI() {
    moneyUI.textContent = `$${money}`;

    const invMax = maxInventory >= MAX_INVENTORY;
    const speedMax = fishingSpeed <= MIN_FISHING_SPEED;
    const boatMax = boatSpeed >= MAX_BOAT_SPEED;
    const researchMax = fishPerCatch >= MAX_FISH_PER_CATCH;

    setUpgradeCost(invCostUI, invMax, inventoryUpgradeCost);
    setUpgradeCost(speedCostUI, speedMax, fishingSpeedUpgradeCost);
    setUpgradeCost(boatCostUI, boatMax, boatSpeedUpgradeCost);
    setUpgradeCost(researchCostUI, researchMax, researchUpgradeCost);

    invBtn.disabled = money < inventoryUpgradeCost || maxInventory >= MAX_INVENTORY;
    speedBtn.disabled = money < fishingSpeedUpgradeCost || fishingSpeed <= MIN_FISHING_SPEED;
    boatBtn.disabled = money < boatSpeedUpgradeCost || boatSpeed >= MAX_BOAT_SPEED;
    researchBtn.disabled = money < researchUpgradeCost || fishPerCatch >= MAX_FISH_PER_CATCH;

    invLevelEl.textContent = invLevel;
    speedLevelEl.textContent = speedLevel;
    boatLevelEl.textContent = boatLevel;
    researchLevelEl.textContent = researchLevel;

    // Show MAX labels
    invMaxLabel.classList.toggle("hidden", maxInventory < MAX_INVENTORY);
    speedMaxLabel.classList.toggle("hidden", fishingSpeed > MIN_FISHING_SPEED);
    boatMaxLabel.classList.toggle("hidden", boatSpeed < MAX_BOAT_SPEED);
    researchMaxLabel.classList.toggle("hidden", fishPerCatch < MAX_FISH_PER_CATCH);

    // NEW: Update Quota UI
    gameLevelEl.textContent = gameLevel;
    quotaProgressEl.textContent = totalFishCaught;
    quotaGoalEl.textContent = levelGoal;

    if (totalFishCaught >= levelGoal) {
        quotaProgressEl.style.color = "#00ff00"; // Green if ready
    } else {
        quotaProgressEl.style.color = "white";
    }

}

function spawnFishText(amount) {
    const div = document.createElement("div");
    div.className = "floating-text fish-text";
    div.textContent = `+${amount} 🐟`;

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

function spawnLevelText(text) {
    const div = document.createElement("div");
    div.className = "floating-text";
    div.style.color = "#ffea00";
    div.style.fontSize = "30px";
    div.style.width = "300px";
    div.style.textAlign = "center";
    div.textContent = text || `LEVEL UP!`;
    document.body.appendChild(div);
    updateFloatingTextPosition(div, 4);
    setTimeout(() => div.remove(), 3000);
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
scene.background = new THREE.Color(0x87CEEB); // LEVEL 1: SKY BLUE

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

// VISUAL: Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Handle Resize Resolution
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// VISUAL: Sunny Lighting Upgrade
// Hemisphere light (Sky + Ground bounce)
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0077be, 0.8);
scene.add(hemiLight);

// Directional light (Sun - Shadows)
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(30, 50, 20); // Higher sun
dirLight.castShadow = true;
// Shadow properties
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.left = -30;
dirLight.shadow.camera.right = 30;
dirLight.shadow.camera.top = 30;
dirLight.shadow.camera.bottom = -30;
scene.add(dirLight);

// Ocean
// VISUAL: Infinite Ocean Illusion
const oceanGeo = new THREE.PlaneGeometry(200, 200, 100, 100);
const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x00BFFF, // Deep Sky Blue / Tropical Water
    flatShading: true, // Low poly look
    roughness: 0.1,
    metalness: 0.05
});

// Ensure dynamic usage for wave animation
oceanGeo.attributes.position.usage = THREE.DynamicDrawUsage;

const ocean = new THREE.Mesh(oceanGeo, oceanMat);
ocean.rotation.x = -Math.PI / 2; // flat
ocean.position.y = 0;
ocean.receiveShadow = true;
scene.add(ocean);

const OCEAN_LIMIT = 20; // playable area size (Kept Same)

// Boat
function createCustomBoat() {
    const boat = new THREE.Group();

    const woodMat = new THREE.MeshStandardMaterial({
        color: 0x7B3F00,
        roughness: 0.8
    });

    const whiteMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5
    });

    // Bottom base
    const base = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 3), woodMat);
    base.position.y = 0.2;
    base.castShadow = true;
    base.receiveShadow = true;
    boat.add(base);

    // Left side
    const leftSide = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 3), woodMat);
    leftSide.position.set(-1, 0.6, 0);
    leftSide.castShadow = true;
    boat.add(leftSide);

    // Right side
    const rightSide = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 3), woodMat);
    rightSide.position.set(1, 0.6, 0);
    rightSide.castShadow = true;
    boat.add(rightSide);

    // Front side
    const frontSide = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 0.3), woodMat);
    frontSide.position.set(0, 0.6, 1.5);
    frontSide.castShadow = true;
    boat.add(frontSide);

    // Back side
    const backSide = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 0.3), woodMat);
    backSide.position.set(0, 0.6, -1.5);
    backSide.castShadow = true;
    boat.add(backSide);

    const poleGeo = new THREE.BoxGeometry(0.5, 3, 0.5);
    const pole = new THREE.Mesh(poleGeo, whiteMat);
    pole.position.set(0, 2, 0);
    pole.castShadow = true;
    boat.add(pole);

    const sailGeo = new THREE.BoxGeometry(0.5, 1.5, 3);
    const sail = new THREE.Mesh(sailGeo, whiteMat);
    sail.position.set(0, 2.5, 0);
    sail.castShadow = true;
    boat.add(sail);

    // Rotate so forward is correct
    boat.rotation.y = Math.PI / 2;

    // Float height
    boat.position.y = 0.5;

    return boat;
}
const boat = createCustomBoat();
scene.add(boat);

// Buoy
const buoyGeo = new THREE.CylinderGeometry(0.2, 0.3, 1, 12);
const buoyMat = new THREE.MeshStandardMaterial({ color: 0xff3d00, roughness: 0.5 });

const buoys = [];

function createBuoy(x, y, z) {
    const buoy = new THREE.Mesh(buoyGeo, buoyMat);
    buoy.position.set(x, 0.5, z);
    buoy.castShadow = true;
    buoy.receiveShadow = true;
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
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x888888, flatShading: true });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 1.5, 0); //x,y,z
    body.castShadow = true;
    body.receiveShadow = true;
    factory.add(body);

    // Roof
    const roofGeo = new THREE.BoxGeometry(6.5, 1, 6.5);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x555555, flatShading: true });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 3.5, 0); //x,y,z
    roof.castShadow = true;
    roof.receiveShadow = true;
    factory.add(roof);

    // Chimney
    const chimneyGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 12);
    const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
    chimney.position.set(2, 3.5, 2); //x,y,z
    chimney.castShadow = true;
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

// Dock
function createDock(x, z) {
    const dockGroup = new THREE.Group();
    dockGroup.position.set(x, 0, z);

    // 1. Wooden Dock
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.9 });

    // Main platform (Back)
    const backGeo = new THREE.BoxGeometry(4, 0.2, 1.5);
    const back = new THREE.Mesh(backGeo, woodMat);
    back.position.set(0, 0.2, -1.8);
    back.castShadow = true;
    back.receiveShadow = true;
    dockGroup.add(back);

    // Left arm
    const sideGeo = new THREE.BoxGeometry(1, 0.2, 3.5);
    const left = new THREE.Mesh(sideGeo, woodMat);
    left.position.set(-1.5, 0.2, 0.2);
    left.castShadow = true;
    left.receiveShadow = true;
    dockGroup.add(left);

    // Right arm
    const right = new THREE.Mesh(sideGeo, woodMat);
    right.position.set(1.5, 0.2, 0.2);
    right.castShadow = true;
    right.receiveShadow = true;
    dockGroup.add(right);

    // Pilings (legs)
    const pileGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5);
    const pileLocations = [[-1.5, 1.5], [1.5, 1.5], [-1.5, -1.5], [1.5, -1.5], [0, -2]];
    pileLocations.forEach(loc => {
        const p = new THREE.Mesh(pileGeo, woodMat);
        p.position.set(loc[0], -0.5, loc[1]);
        p.castShadow = true;
        dockGroup.add(p);
    });

    // 3. Holographic Cylinder (Beam)
    const beamGeo = new THREE.CylinderGeometry(1.8, 1.8, 8, 32, 1, true); // Open ended
    const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00e676,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 2, 0);
    dockGroup.add(beam);
    dockGroup.userData.beam = beam; // Ref for animation

    scene.add(dockGroup);
    return dockGroup;
}

sellZone = createDock(
    factory.position.x,
    factory.position.z + 6
);

//Quota Zone (House on Platform)
function createQuotaZone(x, z) {
    const quotaGroup = new THREE.Group();
    quotaGroup.position.set(x, 0, z);

    // Platform (Concrete/Stone)
    const platGeo = new THREE.BoxGeometry(4, 0.6, 4);
    const platMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const plat = new THREE.Mesh(platGeo, platMat);
    plat.position.y = 0.2;
    plat.receiveShadow = true;
    quotaGroup.add(plat);

    // OPTIMIZED: Use cached material
    const warningPlat = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 3), quotaPlatMat);
    warningPlat.position.y = 0.25; // Slightly higher to avoid Z-fight
    warningPlat.receiveShadow = true;
    quotaGroup.add(warningPlat);

    // House Group (Empty initially, populated by updateLevelVisuals)
    houseMesh = new THREE.Group();
    quotaGroup.add(houseMesh);

    // Holographic Beam (Yellow)
    const beamGeo = new THREE.CylinderGeometry(2.5, 2.5, 10, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
        color: 0xffea00,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 2;
    quotaGroup.add(beam);
    quotaGroup.userData.beam = beam;

    scene.add(quotaGroup);
    return quotaGroup;
}

// House Geometry based on Level
function updateHouseVisuals(level) {
    // clear old house
    while (houseMesh.children.length > 0) {
        houseMesh.remove(houseMesh.children[0]);
    }

    // OPTIMIZED: Use cached materials

    if (level === 1) {
        // Level 1: Small Shack
        const body = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), houseBodyMat);
        body.position.y = 1.5;
        body.castShadow = true;
        houseMesh.add(body);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1, 4), houseRoofMat);
        roof.position.y = 3;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        houseMesh.add(roof);
    }
    else if (level === 2) {
        // Level 2: Cabin with Porch
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), houseBodyMat);
        body.position.y = 1.75;
        body.castShadow = true;
        houseMesh.add(body);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(2, 1.2, 4), houseRoofMat);
        roof.position.y = 3.6;
        roof.rotation.y = Math.PI / 4;
        houseMesh.add(roof);

        // Porch light
        const lightGeo = new THREE.SphereGeometry(0.2);
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const light = new THREE.Mesh(lightGeo, lightMat);
        light.position.set(0, 2.5, 1.4);
        houseMesh.add(light);
    }
    else {
        // Level 3: Lighthouse Tower
        const body = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.5, 5, 8), lighthouseBodyMat);
        body.position.y = 3;
        body.castShadow = true;
        houseMesh.add(body);

        const top = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1, 8), lighthouseTopMat);
        top.position.y = 5.8;
        houseMesh.add(top);

        // Beaming light
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.5), lightBulbMat);
        bulb.position.y = 6;
        houseMesh.add(bulb);
    }
}

// Place Quota Zone to the TOP LEFT corner
quotaZone = createQuotaZone(
    -16,
    -16
);
updateHouseVisuals(1); // Init Level 1 house

//Check Boat In The Zone
function isBoatInSellZone() {
    const dx = boat.position.x - sellZone.position.x;
    const dz = boat.position.z - sellZone.position.z;
    return Math.sqrt(dx * dx + dz * dz) < 2.5;
}

function isBoatInQuotaZone() {
    const dx = boat.position.x - quotaZone.position.x;
    const dz = boat.position.z - quotaZone.position.z;
    return Math.sqrt(dx * dx + dz * dz) < 2.5;
}

// Fishing Zone Logic
function createFishingZone() {
    const zone = new THREE.Group();

    // The "Ripple" Ring
    const ringGeo = new THREE.RingGeometry(1.7, 2.0, 32);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    zone.add(ring);
    zone.userData.ring = ring;

    // The Bubbles
    const bubbles = [];
    const bubbleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });

    for (let i = 0; i < 8; i++) {
        const b = new THREE.Mesh(bubbleGeo, bubbleMat);
        const r = Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        b.position.set(r * Math.cos(theta), Math.random() * -1, r * Math.sin(theta));
        zone.add(b);
        bubbles.push({
            mesh: b,
            speed: 0.02 + Math.random() * 0.03,
            resetY: -1.0
        });
    }
    zone.userData.bubbles = bubbles;

    // Spinning Fish Silhouettes
    const fishShapes = [];
    const fishGeo = new THREE.ConeGeometry(0.1, 0.4, 8);
    fishGeo.rotateX(Math.PI / 2); // Point forward
    const fishMat = new THREE.MeshBasicMaterial({ color: 0x008080 }); // Teal dark fish

    for (let i = 0; i < 5; i++) {
        const f = new THREE.Mesh(fishGeo, fishMat);
        // We will animate position in the loop
        zone.add(f);
        fishShapes.push({
            mesh: f,
            angle: (i / 5) * Math.PI * 2,
            radius: 1.2 + Math.random() * 0.4,
            speed: 0.02 + Math.random() * 0.01
        });
    }
    zone.userData.fish = fishShapes;


    // Initialize zone specific data
    zone.userData.timer = Math.random() * ZONE_LIFETIME;

    scene.add(zone);
    fishingZones.push(zone);

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

    // Reset this specific zone's timer
    zone.userData.timer = 0;
    if (zone.userData.ring) zone.userData.ring.material.opacity = 0.7;
}

// Initialize multiple zones
for (let i = 0; i < ZONE_COUNT; i++) {
    createFishingZone();
}

function isBoatInFishingZone() {
    // Check against ALL zones
    for (let zone of fishingZones) {
        const dx = boat.position.x - zone.position.x;
        const dz = boat.position.z - zone.position.z;
        if (Math.sqrt(dx * dx + dz * dz) < 2) {
            return true;
        }
    }
    return false;
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
        // NEW: Track total fish
        totalFishCaught += fishPerCatch;

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

// Complete Level Logic & Visuals
function completeLevel() {
    if (totalFishCaught >= levelGoal) {

        if (gameLevel === 3) {
            // Win Condition
            winScreen.classList.remove("hidden");
            return;
        }

        gameLevel++;
        totalFishCaught = 0; // Reset counter for next level contract

        // Level Goals
        if (gameLevel === 2) levelGoal = 1500;
        if (gameLevel === 3) levelGoal = 3000;

        spawnLevelText(`CONTRACT ACCEPTED: LEVEL ${gameLevel}`);

        // Update House
        updateHouseVisuals(gameLevel);

        // Change Sky/Lighting
        if (gameLevel === 2) {
            // Sunset
            scene.background = new THREE.Color(0xFF4500); // Orange Red
            if (scene.fog) scene.fog.color.setHex(0xFF4500); // FIX: Check for fog existence
            dirLight.color.setHex(0xFFD700); // Gold sun
            dirLight.intensity = 0.8;
        }
        if (gameLevel === 3) {
            // Night
            scene.background = new THREE.Color(0x000033); // Dark Blue
            if (scene.fog) scene.fog.color.setHex(0x000033); // FIX: Check for fog existence
            dirLight.color.setHex(0xaaaaaa); // Moon
            dirLight.intensity = 0.4;
            hemiLight.groundColor.setHex(0x000000);
        }
    }
}

restartBtn.addEventListener("click", () => {
    location.reload();
});

//Upgrade
function upgradeInventory() {
    if (money < inventoryUpgradeCost) return;
    if (maxInventory >= MAX_INVENTORY) return;

    money -= inventoryUpgradeCost;
    spawnMoneyText(-inventoryUpgradeCost);

    maxInventory += 100;
    invLevel++;

    inventoryUpgradeCost += 100;
}

function upgradeFishingSpeed() {
    if (money < fishingSpeedUpgradeCost) return;
    if (fishingSpeed <= MIN_FISHING_SPEED) return;

    money -= fishingSpeedUpgradeCost;
    spawnMoneyText(-fishingSpeedUpgradeCost);

    fishingSpeed -= 1000;
    speedLevel++;

    fishingSpeedUpgradeCost += 200;

    if (isFishing) {
        stopFishing();
        startFishing();
    }
}

function upgradeBoatSpeed() {
    if (money < boatSpeedUpgradeCost) return;
    if (boatSpeed >= MAX_BOAT_SPEED) return;

    money -= boatSpeedUpgradeCost;
    spawnMoneyText(-boatSpeedUpgradeCost);

    boatSpeed += 0.02;
    boatLevel++;

    boatSpeedUpgradeCost += 300;
}

function upgradeFishResearch() {
    if (money < researchUpgradeCost) return;
    if (fishPerCatch >= MAX_FISH_PER_CATCH) return;

    money -= researchUpgradeCost;
    spawnMoneyText(-researchUpgradeCost);

    fishPerCatch += 10;
    researchLevel++;

    researchUpgradeCost += 500;
}

//Controls
const keys = {};

window.addEventListener("keydown", (e) => {
    if (e.repeat) return; // OPTIMIZED: Prevent key spamming

    const key = e.key.toLowerCase();
    keys[key] = true;

    if (key === "f" && canFish) toggleFishing();
    if (key === "e" && canSell) sellFish();
    // NEW: Quota Key
    if (key === "q" && canCompleteLevel) completeLevel();

    if (key === "1") upgradeInventory();
    if (key === "2") upgradeFishingSpeed();
    if (key === "3") upgradeBoatSpeed();
    if (key === "4") upgradeFishResearch();
});

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

fishBtn.addEventListener("click", () => {
    if (!canFish) return;

    toggleFishing();
});

sellBtn.addEventListener("click", () => {
    if (!canSell) return;

    sellFish();
});

// NEW: Quota Button Listener
quotaBtn.addEventListener("click", () => {
    if (!canCompleteLevel) return;
    completeLevel();
});

invBtn.onclick = upgradeInventory;
speedBtn.onclick = upgradeFishingSpeed;
boatBtn.onclick = upgradeBoatSpeed;
researchBtn.onclick = upgradeFishResearch;

function createWake() {
    const wake = new THREE.Mesh(wakeGeo, wakeMat.clone());
    wake.rotation.x = -Math.PI / 2;
    wake.position.copy(boat.position);
    wake.position.y = 0.02; // Just above water
    scene.add(wake);
    wakes.push({ mesh: wake, life: 1.0 });
}

//animation variable
let floatTime = 0;
let buoyTime = 0;
let canFish = false;
let wakeTimer = 0;

//render
function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta() * 1000; // ms
    const time = clock.getElapsedTime();

    // Low Poly Waves
    const positionAttribute = ocean.geometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i); // y is actually flat local coord

        // Simple sine wave displacement
        const z = 0.2 * Math.sin(x * 0.5 + time) * Math.cos(y * 0.3 + time);
        positionAttribute.setZ(i, z);
    }
    positionAttribute.needsUpdate = true;
    // Removed computeVertexNormals for performance/flat shading

    // Buoy
    buoyTime += 0.03;
    buoys.forEach((b, i) => {
        b.position.y = 0.4 + Math.sin(buoyTime + i) * 0.1;
    });

    // Factory Bob
    factory.position.y = Math.sin(time * 0.5) * 0.2;

    // Quota Zone Bob
    if (houseMesh) houseMesh.position.y = Math.sin(time * 0.5) * 0.1;

    // Boat
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

    // Wake Spawn
    if (moving) {
        wakeTimer += deltaTime;
        if (wakeTimer > 100) { // Spawn every 100ms
            createWake();
            wakeTimer = 0;
        }
    }

    // Update Wakes
    for (let i = wakes.length - 1; i >= 0; i--) {
        let w = wakes[i];
        w.life -= 0.02;
        w.mesh.material.opacity = w.life * 0.5;
        w.mesh.scale.setScalar(2 - w.life); // Grow slightly

        if (w.life <= 0) {
            scene.remove(w.mesh);
            wakes.splice(i, 1);
        }
    }

    // Limit boat
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

    //Factory Collision
    if (checkFactoryCollision()) {
        boat.position.x = prevX;
        boat.position.z = prevZ;
    }

    //Factory Zone
    canSell = isBoatInSellZone();
    // VISUAL: Sell Zone (Dock) Bob
    sellZone.position.y = Math.sin(time * 1.5) * 0.05; // Gentle bobbing of dock
    // Hologram Pulse
    if (sellZone.userData.beam) {
        const beam = sellZone.userData.beam;
        beam.material.opacity = 0.1 + Math.sin(time * 3) * 0.05;
        // Turn bright green if can sell
        beam.material.color.setHex(canSell ? 0x00ff00 : 0x00e676);
    }

    // NEW: Quota Zone Logic
    canCompleteLevel = isBoatInQuotaZone() && totalFishCaught >= levelGoal;
    if (quotaZone && quotaZone.userData.beam) {
        const beam = quotaZone.userData.beam;
        beam.material.opacity = 0.1 + Math.sin(time * 4) * 0.05;
        // Turn Green if ready to complete, otherwise Yellow
        beam.material.color.setHex(totalFishCaught >= levelGoal ? 0x00ff00 : 0xffea00);
    }

    //Fishing Zones Update
    let inAnyZone = false;

    fishingZones.forEach(zone => {
        // Update this zone's timer
        zone.userData.timer += deltaTime;

        // Opacity Logic
        let currentOpacity = THREE.MathUtils.lerp(
            0.7,
            MIN_ZONE_OPACITY,
            zone.userData.timer / ZONE_LIFETIME
        );

        // Check distance for this specific zone
        const dx = boat.position.x - zone.position.x;
        const dz = boat.position.z - zone.position.z;
        const insideThisZone = Math.sqrt(dx * dx + dz * dz) < 2;

        if (insideThisZone) inAnyZone = true;

        // Visual feedback if inside
        if (zone.userData.ring) {
            zone.userData.ring.material.opacity = insideThisZone
                ? Math.min(currentOpacity + 0.2, 0.9)
                : currentOpacity;

            // Ripple Effect (Pulse)
            const s = 1 + Math.sin(time * 3) * 0.1;
            zone.userData.ring.scale.set(s, s, 1);
        }

        // VISUAL: Fishing Zone Animation

        // 1. Bubbles rising
        zone.userData.bubbles.forEach(bObj => {
            bObj.mesh.position.y += bObj.speed;
            // Reset if too high
            if (bObj.mesh.position.y > 1.5) {
                bObj.mesh.position.y = bObj.resetY;
                bObj.mesh.position.x = (Math.random() * 2 - 1) * 1.5;
                bObj.mesh.position.z = (Math.random() * 2 - 1) * 1.5;
            }
        });

        // 2. Spinning Fish
        zone.userData.fish.forEach(fObj => {
            fObj.angle += fObj.speed;
            fObj.mesh.position.x = Math.cos(fObj.angle) * fObj.radius;
            fObj.mesh.position.z = Math.sin(fObj.angle) * fObj.radius;
            // Face direction of movement
            fObj.mesh.rotation.y = -fObj.angle;
            // Bob slightly
            fObj.mesh.position.y = -0.5 + Math.sin(time * 5 + fObj.angle) * 0.1;
        });


        // Move logic
        if (zone.userData.timer >= ZONE_LIFETIME) {
            moveFishingZone(zone);
        }
    });

    canFish = inAnyZone;

    // Auto stop fishing if we left all zones or zones moved away
    if (isFishing && !canFish) {
        stopFishing();
    }

    // Fishing UI
    if (canFish) {
        fishBtn.classList.remove("hidden");
        sellBtn.classList.add("hidden");
        quotaBtn.classList.add("hidden"); // Hide quota if fishing

        if (isFishing) {
            fishBtn.textContent = "🛑 Reel In";
            fishBtn.classList.remove("start");
            fishBtn.classList.add("stop");
        } else {
            fishBtn.textContent = "🎣 Cast Line";
            fishBtn.classList.remove("stop");
            fishBtn.classList.add("start");
        }
    } else {
        fishBtn.classList.add("hidden");
    }

    // Sell UI
    if (canSell) {
        sellBtn.classList.remove("hidden");
        fishBtn.classList.add("hidden");
        quotaBtn.classList.add("hidden"); // Priority to sell
    } else {
        sellBtn.classList.add("hidden");
    }

    // Quota UI
    if (canCompleteLevel && !canSell && !canFish) {
        quotaBtn.classList.remove("hidden");
    } else {
        quotaBtn.classList.add("hidden");
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