// define pricing for each sku
// this gets loaded after sku.js
// added flash drive normal pricing - rr Jan 2013

// constructor for one discount entry
// minQty, maxQty are the (inclusive/inclusive) quantities
// if maxQty is -1 it means, 'or more' (this semantics not used for minQty)
// this discount price applies to
// unit_price is the price per item for this range
function oDiscountEntry(minQty,maxQty,unitPrice)
{
	this.minQty=minQty;
	this.maxQty=maxQty;
	this.unitPrice=unitPrice;
}

// constructor for a pricing object
function oPrice(unitPrice,discounts)
{
	this.unitPrice=unitPrice;
	this.discounts=discounts;
}

var priceList=new Array(nSku);

// initialize priceList, indexed by SKU id

// the pricelist for the CD-ROM 3.0 (CD30)
// no discounts
priceList["cd30"]=new oPrice(20.00, null);

// the pricelist for the CD-ROM 5.0 (CD50)
var cd50DiscountList=[
	{minQty:2,maxQty:2,unitPrice:39.95},
	{minQty:3,maxQty:3,unitPrice:33.33},
	{minQty:4,maxQty:4,unitPrice:29.00},
	{minQty:5,maxQty:-1,unitPrice:25.00}
];

priceList["cd50"]=new oPrice(39.95,cd50DiscountList);

// the pricelist for the DVD-ROM 9.0 (DVD90)
var dvd90DiscountList=[
	{minQty:2,maxQty:2,unitPrice:89.95},
	{minQty:3,maxQty:3,unitPrice:80.95},
	{minQty:4,maxQty:4,unitPrice:72.95},
	{minQty:5,maxQty:5,unitPrice:65.95},
	{minQty:6,maxQty:6,unitPrice:58.95},
	{minQty:7,maxQty:7,unitPrice:52.95},
	{minQty:8,maxQty:8,unitPrice:47.95},
	{minQty:9,maxQty:9,unitPrice:43.95},
	{minQty:10,maxQty:-1,unitPrice:39.95}
];

priceList["dvd90"]=new oPrice(99.95,dvd90DiscountList);

// the pricelist for the FLASH DRIVE 9.0 (FLD90) Holiday Special
// rr jan 2014 normal 127/99.95 = 1.27
// e,g, qty (2) 89.95 * 1.27 = 114.25
var fld90DiscountList=[
	{minQty:2,maxQty:2,unitPrice:114.25},
	{minQty:3,maxQty:3,unitPrice:102.80},
	{minQty:4,maxQty:4,unitPrice:92.65},
	{minQty:5,maxQty:5,unitPrice:83.75},
	{minQty:6,maxQty:6,unitPrice:74.90},
	{minQty:7,maxQty:7,unitPrice:67.25},
	{minQty:8,maxQty:8,unitPrice:60.90},
	{minQty:9,maxQty:9,unitPrice:55.80},
	{minQty:10,maxQty:-1,unitPrice:50.75}
];
// rr jan 2014 make sure price for single unit is here
priceList["fld90"]=new oPrice(127.00,fld90DiscountList);

// the pricelist for the World Religions (CD801) disk
var cd801DiscountList=[
	{minQty:5,maxQty:9,unitPrice:15.00},
	{minQty:10,maxQty:-1,unitPrice:12.00}
];

priceList["cd801"]=new oPrice(19.95,cd801DiscountList);

// the pricelist for the Myth and Folklore (CD802) disk
var cd802DiscountList=[
	{minQty:5,maxQty:9,unitPrice:15.00},
	{minQty:10,maxQty:-1,unitPrice:12.00}
];

priceList["cd802"]=new oPrice(19.95,cd802DiscountList);

// the pricelist for the Magick and Mystery (CD803) disk
var cd803DiscountList=[
	{minQty:5,maxQty:9,unitPrice:15.00},
	{minQty:10,maxQty:-1,unitPrice:12.00}
];

priceList["cd803"]=new oPrice(19.95,cd803DiscountList);

// the pricelist for the CD-ROM 3-Pack
var cd8allDiscountList=[
	{minQty:2,maxQty:2,unitPrice:39.95},
	{minQty:3,maxQty:3,unitPrice:33.33},
	{minQty:4,maxQty:4,unitPrice:29.00},
	{minQty:5,maxQty:-1,unitPrice:25.00}
];

priceList["cd8all"]=new oPrice(49.95,cd8allDiscountList);

// the pricelist for the CD-ROM 3-Pack upgrade
// no discounts
priceList["cd8allup"]=new oPrice(39.95,null);

// the pricelist for the Bible CD-ROM 8.0 (CDB8)
// no discounts
priceList["cdb8"]=new oPrice(9.95, null);

// the pricelist for the Quran CD-ROM 9.0 (CDQ9)
// no discounts
priceList["cdq9"]=new oPrice(9.95, null);


// return the pricing object for sku idSku
function getItemPricing(idSku) {
	return(priceList[idSku]);
}

// get the unit price per time for qty of idSku
function getItemUnitPrice(idSku,qty)
{
	if (!qty)
		return(0);
	var pricing=getItemPricing(idSku);

	if (pricing && pricing.discounts) {
		var discounts=pricing.discounts;

		for (var i=0;i<discounts.length;i++) {
			var discount=discounts[i];
			var minQty=discount.minQty;
			var maxQty=discount.maxQty;

			if (maxQty==-1 && qty>=minQty)
				return discount.unitPrice;
			if (qty>=minQty && qty<=maxQty)
				return discount.unitPrice;
		}
		return pricing.unitPrice;
	}
	if (pricing) {
		return pricing.unitPrice;
	}
	return 0;
}

// return the price for qty units of sku idSku
function computeItemPrice(idSku,qty) {
	if (qty==0)
		return 0;
	var retval=qty * getItemUnitPrice(idSku,qty);
	return(truncateDollars(retval));
}

function truncateDollars(val) {
	return Math.floor(val*100.0)/100.0;
}
