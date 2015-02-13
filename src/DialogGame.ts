class DialogGame extends egret.Sprite {

    private txt: egret.TextField = new egret.TextField();
    private shape: egret.Shape = new egret.Shape();
    public constructor() {
        super();

        this.addChild(this.shape); 
        this.addChild(this.txt);
        this.touchEnabled = true; 
        this.shape.touchEnabled = true;
        this.shape.width = 300;
        this.shape.height = 200;
        this.shape.graphics.beginFill(0xFF11FF);
        this.shape.graphics.drawRoundRect(0, 0, 300, 200, 30, 30);
        this.shape.graphics.endFill();
        
    }
    public showDialog(txtStr:string): void {
        this.txt.text = txtStr;
        this.txt.x = this.width / 2 - this.txt.textWidth / 2;
        this.txt.y = this.height / 2 - this.txt.textHeight / 2;
        
    }
    
}