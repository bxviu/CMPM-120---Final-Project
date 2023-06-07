class HelperScene extends Phaser.Scene
{
	constructor(key, name) {
        super(key);
        this.name = name;
    }
    typewriteText(text)
    {
        const length = text.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.label.text += text[i]
                ++i
            },
            repeat: length - 1,
            delay: 200
        })
    }
    typewriteTextWrapped(text)
    {
        const lines = this.label.getWrappedText(text)
        const wrappedText = lines.join('\n')

        this.typewriteText(wrappedText)
    }
}

export default HelperScene;
