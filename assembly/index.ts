import { physics, Direction } from "./physics";

const player:physics.Body2D = new physics.Body2D(280, 0, 35, 40);

export function movingLeft():void {
  player.direction = Direction.LEFT;
  player.isMoving = true;
}

export function movingRight():void {
  player.direction = Direction.RIGHT;
  player.isMoving = true;
}

export function jump():void {
  player.jump();
}

export function stopMoving():void {
  player.isMoving = false;
}

physics.addBody(player);

physics.addBody(new physics.Body2D(0, 590, 900, 10, true));
physics.addBody(new physics.Body2D(0, 300, 75, 10, true));
physics.addBody(new physics.Body2D(200, 400, 230, 10, true));
physics.addBody(new physics.Body2D(100, 500, 30, 10, true));
physics.addBody(new physics.Body2D(890, 0, 10, 600, true));
physics.addBody(new physics.Body2D(0, 0, 10, 600, true));

export function update(delta:i32):void {
  physics.step();
}