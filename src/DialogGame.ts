class DialogGame extends egret.Sprite {

    private txt: egret.TextField = new egret.TextField();
    private shape: egret.Bitmap = new egret.Bitmap();
    public constructor() {
        super();
        this.touchEnabled = true; 
        this.shape.texture = RES.getRes("dialog_png");
        this.shape.touchEnabled = true;
        this.addChild(this.shape);
        this.addChild(this.txt);

     
        
    }
    public showDialog(txtStr:string): void {
        this.txt.text = txtStr;
        this.txt.x = this.width / 2 - this.txt.textWidth / 2;
        this.txt.y = this.height / 2 - this.txt.textHeight / 2;
        
    }
    
}