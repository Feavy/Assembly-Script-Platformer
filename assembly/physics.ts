import { fillRect, setColor } from "./g2d";

export enum Direction {
    LEFT, RIGHT
}

export namespace physics {
    export namespace utils {
        export function isCollision(a: Body2D, b: Body2D): boolean {
            return !((a.x + a.w < b.x) || (a.y + a.h < b.y) || (a.x > b.x + b.w) || (a.y > b.y + b.h));
        }
    }

    export class Body2D {
        public x: i32;
        public y: i32;
        public w: i32;
        public h: i32;
        public readonly isStatic: boolean;

        public velocityX: f32 = 0;
        public velocityY: f32 = 0;

        public onGround: boolean = false;

        public isMoving: boolean = false;

        public static SPEED: f32 = 4;

        public direction: Direction = Direction.LEFT;

        public constructor(x: i32, y: i32, w: i32, h: i32, isStatic: boolean = false) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.isStatic = isStatic;
        }

        public update(): void {
            this.x += i32(this.velocityX);
            this.y += i32(this.velocityY);

            if (this.onGround && this.velocityY > 0)
                this.onGround = false;

            if (this.isMoving && Math.abs(this.velocityX) < physics.Body2D.SPEED) {
                this.velocityX += (this.direction == Direction.LEFT) ? -0.1 : 0.1;
            } else if (!this.isMoving && this.velocityX != 0) {
                if (Math.abs(this.velocityX) < 0)
                    this.velocityX = 0;
                else if (this.velocityX > 0) {
                    this.velocityX -= this.onGround ? 0.1 : 0.03;
                } else {
                    this.velocityX += this.onGround ? 0.1 : 0.03;
                }
            }
        }

        public draw(): void {
            fillRect(this.x, this.y, this.w, this.h);
        }

        public jump():void {
            if(this.onGround) {
                this.velocityY = -9.5;
                this.onGround = false;
            }
        }
    }

    const FORCE: f32 = 9.8;
    const bodies: Array<physics.Body2D> = new Array<physics.Body2D>();

    export function addBody(body: Body2D): void {
        bodies.push(body);
    }

    export function step(): void {
        setColor(255, 255, 255);
        fillRect(0, 0, 900, 600);
        setColor(0, 255, 255);
        // Updates
        for (let i = 0; i < bodies.length; i++) {
            let e = bodies[i];
            if (e.isStatic) {
                e.draw();
                continue;
            }
            if (e.velocityY < FORCE) {
                e.velocityY += 0.2;
                if (e.velocityY > FORCE)
                    e.velocityY = FORCE;
            }

            for (let j = 0; j < bodies.length; j++) {
                let e2 = bodies[j];
                if (e === e2)
                    continue;

                var h1: Body2D = new Body2D(e.x + i32(e.velocityX), e.y + 1, e.w, e.h - 2);
                var h2: Body2D = new Body2D(e2.x, e2.y + 1, e2.w, e2.h - 2);

                if (utils.isCollision(h1, h2)) {
                    if (e.velocityX > 0 && e.x < e2.x) {    // Vers la droite
                        e.x = e2.x - e.w;
                        e.velocityX = 0;
                    } else if (e.velocityX < 0 && e.x > e2.x) {    // Vers la gauche
                        e.x = e2.x + e2.w;
                        e.velocityX = 0;
                    }
                }

                h1 = new Body2D(e.x + 1, e.y + i32(e.velocityY), e.w - 2, e.h);
                h2 = new Body2D(e2.x + 1, e2.y, e2.w - 2, e2.h);

                if (utils.isCollision(h1, h2)) {
                    // Verification e2.y > e.y pour éviter les fausses détection lors de la chute après collision
                    if (e.velocityY > 0 && e2.y > e.y) {    // Vers le bas
                        e.y = e2.y - e.h;
                        e.onGround = true;
                        e.velocityY = 0;
                    } else if (e.velocityY < 0) {    // Vers le haut
                        e.y = e2.y + e2.h;
                        e2.onGround = true;
                        e.velocityY = 0;
                    }
                }
            }
            e.update();
            e.draw();
        }
    }
}