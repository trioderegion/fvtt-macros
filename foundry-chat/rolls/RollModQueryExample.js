// snagged from a post by Freeze#2689
new Dialog({
    title: "Roll d100 + mod",
    content: `<div>Modifier: <input name="mod" style="width:30px"/></div>`,
    buttons: {
        roll_it: {
            label: "Roll it",
            callback: (html) => {
                let mod = html.find("[name=mod]")[0].value;
                new Roll(`1d100 + ${mod}`).roll().toMessage()
            }
        }
    }
}).render(true)