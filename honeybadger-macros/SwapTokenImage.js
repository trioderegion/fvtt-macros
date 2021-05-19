const normal = "<Path1>"
const alt = "<Path2>"
const updateImage = token.data.img === normal ? alt : normal;
token.update({ img: updateImage });
