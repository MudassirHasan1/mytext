// sku.js defines the unique number for each 'stock keeping unit'
// the index file is the current hot product. the index realy should be a link ("ln")
// rr jab 2014

// constructor for an sku object
function oSku(id,desc,detail)
{
	this.id=id;
	this.desc=desc;
	this.detail=detailURL;	// detail page for this item
}

// this is conceptually a list of oSkus
// rr dec 2013 add flash drive fld90
var skuList=[
	{id:"cd30", desc:"3.0 CD-ROM",detailURL:"cd30/index.htm"},
	{id:"cd50", desc:"5.0 CD-ROM",detailURL:"cd50/index.htm"},
	{id:"dvd90", desc:"9.0 DVD-ROM",detailURL:"dvd90/dvd90.htm"},
	{id:"fld90", desc:"9.0 FLASH-DRIVE",detailURL:"dvd90/index.htm"},
	{id:"cd801", desc:"World Religions CD-ROM 8.0",detailURL:"cd801/index.htm"},
	{id:"cd802", desc:"Myth and Folklore CD-ROM 8.0",detailURL:"cd802/index.htm"},
	{id:"cd803", desc:"Magick and Mystery CD-ROM 8.0",detailURL:"cd803/index.htm"},
	{id:"cd8all", desc:"8.0 CD-ROM 3-Pack",detailURL:"cd8all/index.htm"},
	{id:"cdb8", desc:"Bible CD-ROM 8.0",detailURL:"cdb8/index.htm"},
	{id:"cdq9", desc:"Quran CD-ROM 9.0",detailURL:"cdq9/index.htm"},
];

var nSku=skuList.length;

// display the left hand menu entries for each SKU entrys' detail page
function displaySkuDetailMenu() {
	for (var i=0;i<nSku;i++) {
		document.write("<A HREF=\"" + skuList[i].detailURL + "\">" +
			skuList[i].desc + "</A><BR>");
	}
}
