// the shopping cart code
var bInit;

// one item in the shopping cart
function oCartItem(idSku,qty) {
	this.idSku=idSku;
	if (qty)
		this.qty=qty;
	else this.qty=0;
}

// shopping cart constructor function
function oCart() {
	this.payby="";
	this.ship="";
	this.items=new Array();
	this.getItemQty=getCartItemQty;
	this.setItemQty=setCartItemQty;
}

// set the quantity of item idSku in cart to qty
// adds an instance of the idSku if there is none yet
function setCartItemQty(cart,idSku,qty) {
	if (cart.items.length) {
		// see if there is an existing instance of this sku and if so
		// update the quantity
		for (var iItem=0;iItem<cart.items.length;iItem++) {
			if (cart.items[iItem].idSku==idSku) {
				cart.items[iItem].qty=qty;
				return;
			}
		}
	}
	// otherwise add a new sku slot in items
	cart.items.push(new oCartItem(idSku,qty));
}

// return the quantity of item idSku in the cart, or 0 if none
function getCartItemQty(cart,idSku) {
	for (var iItem=0;iItem<cart.items.length;iItem++) {
		if (cart.items[iItem].idSku==idSku) {
			return(cart.items[iItem].qty);
		}
	}
	return(0);
}

// convert the entire state of the cart into
// a human readable and parsable string
// and return the string
// returns an empty string if the cart is null or empty
function cartToString(cart) {
	var result="";
	// add flags
	result+="payby:"+cart.payby+";";
	result+="ship:"+cart.ship+";";
	// add items
	if (cart && cart.items.length) {
		for (var iItem=0;iItem<cart.items.length;iItem++) {
			result += cart.items[iItem].idSku;
			result += ":";
			result += cart.items[iItem].qty.toString();
			result += ";";
		}
	}
	return result;
}

// return a shopping cart built from string 's'
function stringToCart(s) {
	var cart=new oCart();
	if (!s || s=="")
		return cart;
	var itemList=s.split(";");
	for (var iItem=0;iItem<itemList.length;iItem++) {
		var itemSplit=itemList[iItem].split(":");
		var id=itemSplit[0];

		// decode flags
		if (id=="payby") {
			cart.payby=itemSplit[1];
			continue;
		}
		if (id=="ship") {
			cart.ship=itemSplit[1];
			continue;
		}
			
		// decode an item
		var qty=parseInt(itemSplit[1]);

		if (qty)
			cart.setItemQty(cart,id,qty);
	}
	return cart;
}

var ISTACartCookieStr="sacred-texts-shop";

// save the cart in a cookie
function saveCart(cart) {
	setCookie(ISTACartCookieStr,cartToString(cart),getExpDate(180,0,0));
}

function getCart() {
	return stringToCart(getCookie(ISTACartCookieStr));
}

// display the (editable) shopping cart
function displayCart() {

	document.write("<form name=\"cartForm\" action=\"checkout.cgi\" method=\"post\">\n");

	displayCartTable();
	document.write("<hr>\n");

	document.write("<table width=\"100%\">\n");
	document.write("<tr>\n");
	writeCartCellPre();
	document.write("<center>");
	document.write("<img src=\"img/cards.jpg\"><br>");
	document.write("<input type=\"submit\" value=\"Buy Online\" onClick=\"submitCart('paypal','b')\">\n");
	document.write("</center>");
	writeCartCellPost();
	writeCartCellPre();
	document.write("<center>");
	document.write("<img src=\"img/mailord.jpg\"><br>");
	document.write("<input type=\"submit\" value=\"Buy by Mail Order\" onClick=\"submitCart('mailord','b')\">\n");
	document.write("</center>");
	writeCartCellPost();
	document.write("</tr>\n");
	document.write("</table>\n");

	document.write("</form>\n");
}

// display the editable cart table. Needs to be surrounded by
// a form in order to work correctly.
function displayCartTable() {
	bInit=true;
	var cart=getCart();

	document.write("<table width=\"100%\" border=\"1\">");
	document.write("<tr>\n");
	writeCartCellPre();
	document.write("ITEM");
	writeCartCellPost();
	writeCartCellPre();
	document.write("QUANTITY");
	writeCartCellPost();
	writeCartCellPre();
	document.write("Unit Price");
	writeCartCellPost();
	writeCartCellPre();
	document.write("Total Price");
	writeCartCellPost();
	document.write("</tr>\n");

	for (var i=0;i<nSku;i++) {

		document.write("<tr>\n");
		writeCartCellPre();
		document.write("<a href=\"" + skuList[i].detailURL + "\">" +
			skuList[i].desc + "</A>\n");
		writeCartCellPost();

		writeCartCellPre();
		var id=skuList[i].id;
		var itemQty=getCartItemQty(cart,skuList[i].id);
		document.write(
			"<input type=\"text\" size=\"2\" value=\""
				+ itemQty.toString()
				+ "\" name=\""
				+ id + "_qty\""
				+ " onChange=\"return QtyChanged(this,"
				+ "'" + id + "'"
				+ ",'" + id + "_price'"
				+ ",'" + id + "_unit_price'"
				+ ")\">\n");
		writeCartCellPost();

		writeCartCellPre("right");
		if (itemQty==0)
			writeDynTextField(id + "_unit_price", getItemUnitPrice(id,1));
		else writeDynTextField(id + "_unit_price", getItemUnitPrice(id,itemQty));
		writeCartCellPost();

		writeCartCellPre(true);
		writeDynTextField(id + "_price", computeItemPrice(id,itemQty));
		writeCartCellPost();

		document.write("</tr>\n");


	}
	document.write("<tr>\n");
	writeEmptyCartCell();
	writeEmptyCartCell();
	writeCartCellPre();
	document.write("TOTAL");
	writeCartCellPost();

	writeCartCellPre(true);
	writeDynTextField("total_price",computeCartTotal(cart));
	writeCartCellPost();
	document.write("</tr>\n");

	document.write("</table>\n");
	bInit=false;
}

// this is called when the cart is submitted on the review page
// it sets the flags ('payby', 'ship') and saves the cart
function submitCart(payby,ship) {
	var cart=getCart();

	cart.payby=payby;
	cart.ship=ship;

	saveCart(cart);
}

// display the shopping cart without allowing user edit
function displayStaticCart() {
	var cart=getCart();

	document.write("<table width=\"100%\" border=\"1\">\n");
	document.write("<tr>\n");
	writeCartCellPre();
	document.write("ITEM");
	writeCartCellPost();
	writeCartCellPre();
	document.write("QUANTITY");
	writeCartCellPost();
	writeCartCellPre();
	document.write("Unit Price");
	writeCartCellPost();
	writeCartCellPre();
	document.write("Total Price");
	writeCartCellPost();
	document.write("</tr>\n");

	for (var i=0;i<nSku;i++) {
		document.write("</tr>\n");
		var id=skuList[i].id;
		var itemQty=getCartItemQty(cart,skuList[i].id);

		if (!itemQty)
			continue;

		document.write("<tr>\n");

		writeCartCellPre();
		document.write(skuList[i].desc);
		writeCartCellPost();

		writeCartCellPre("right");
		document.write(itemQty.toString());
		writeCartCellPost();

		writeCartCellPre("right");
		displayDollars(getItemUnitPrice(id,itemQty));
		writeCartCellPost();

		writeCartCellPre("right");
		displayDollars(computeItemPrice(id,itemQty));
		writeCartCellPost();

		document.write("</tr>\n");
	}

	// write out the grand total
	document.write("<tr>\n");
	writeEmptyCartCell();
	writeEmptyCartCell();
	writeCartCellPre();
	document.write("<B>TOTAL</B>:");
	writeCartCellPost();

	writeCartCellPre("right");
	document.write("<B>");
	displayDollars(computeCartTotal(cart));
	document.write("</B>");
	writeCartCellPost();
	document.write("</tr>\n");

	document.write("</table>\n");
}

// output a readonly text field with identifier 'id' and value 'value'
function writeDynTextField(id,value) {
	document.write("$");
	document.write(
	"<input type=\"text\" size=\"4\" class=\"noin\" readonly name=\"" 
				+ id + "\""
				+ " value=\"");
	document.write(value.toFixed(2));
	document.write("\">\n");
}

// return the total dollar value of the cart
function computeCartTotal(cart)
{
	var total=0;
	for (var iItem=0;iItem<cart.items.length;iItem++) {
		total+=computeItemPrice(cart.items[iItem].idSku,cart.items[iItem].qty);
	}
	return(total);
}

// method called onChange in a quantity field
function QtyChanged(it,id,price_id,unit_price_id)
{
	// don't process blurs during initialization because that leads
	// to infinite recursion and hangs the browser
	if (bInit)
		return;
	if (it.value=="")
		it.value=0;
	if (!IsNumericValue(it.value) || it.value<0) {
		it.value=1;
		alert("Please enter a non-negative number for the quantity");
		return false;
	}
	var cart=getCart();
	setCartItemQty(cart,id,it.value);
	elem=document.cartForm[price_id];
	if (elem)
		elem.value=computeItemPrice(id,it.value).toFixed(2);
	elem=document.cartForm[unit_price_id];
	if (elem)
		elem.value=getItemUnitPrice(id,it.value).toFixed(2);
	updateCartTotal(cart);
	saveCart(cart);
	return true;
}

function updateCartTotal(cart) {
	var elem=document.cartForm["total_price"];
	if (elem)
		elem.value=computeCartTotal(cart).toFixed(2);
}

function writeCartCellPre(szAlign,nColspan) {
	document.write("<td");
	document.write(" valign=\"top\"");
	if (szAlign)
		document.write(" align=\"" + szAlign + "\"");
	else document.write(" align=\"left\"");
	if (nColspan)
		document.write(" colspan=\"" + nColspan + "\"");
	document.write(">\n");
	document.write("<span class=\"p-small\">");
}

function writeCartCellPost() {
	document.write("</span>\n");
	document.write("</td>\n");
}

function writeEmptyCartCell() {
	document.write("<td>&nbsp;</td>\n");
}

function IsNumericValue(val) {
	var i;
	// a value of 0 is okay
	if (val=="" || val<=0) {
		return true;
	}
	for (var i=0;i<val.length;i++) {
		if (val.charAt(i)<"0" || val.charAt(i)>"9") {
			return false;
		}
	}
	return true;
}

function displayPaypalHandoffPage()
{
	var cart=getCart();
	displayStaticCart();
	document.write("<hr>\n");
	document.write("<form>\n");
	document.write("<table border=\"1\">\n");

	outputAddressInputFields("BILLING ADDRESS:","")
	outputAddressInputFields("SHIPPING ADDRESS (IF DIFFERENT THAN BILLING)",
		"ship");
	
	document.write("</table>\n");
	document.write("</form>\n");
}

function outputAddressInputFields(szMainTitle,prefix)
{
	document.write("<tr>\n");
	writeCartCellPre("",3);
	document.write("<B>" + szMainTitle + "</B>");
	writeCartCellPost();
	document.write("</tr>\n");

	document.write("<tr>\n");
	writeCartCellPre();
	document.write("<input type=\"text\" size=\"16\" name=\""+prefix+"first_name\"><br>First Name\n");
	writeCartCellPost();
	writeCartCellPre("",2);
	document.write("<input type=\"text\" size=\"32\" name=\""+prefix+"last_name\"><br>Last Name\n");
	writeCartCellPost();
	document.write("</tr>\n");

	document.write("<tr>\n");
	writeCartCellPre("",3);
	document.write("Street Address:<br><input type=\"text\" size=\"32\" name=\""+prefix+"address1\">\n");
	writeCartCellPost();
	document.write("</tr>\n");

	document.write("<tr>\n");
	writeCartCellPre("",3);
	document.write("<input type=\"text\" size=\"32\" name=\""+prefix+"address2\">\n");
	writeCartCellPost();
	document.write("</tr>\n");

	document.write("<tr>\n");
	writeCartCellPre();
	document.write("<input type=\"text\" size=\"16\" name=\""+prefix+"city\"><BR>City\n");
	writeCartCellPost();
	writeCartCellPre();
	document.write("<input type=\"text\" size=\"16\" name=\""+prefix+"state\"><BR>State/Prov.\n");
	writeCartCellPost();
	writeCartCellPre();
	document.write("<input type=\"text\" size=\"16\" name=\""+prefix+"zip\"><BR>Zip/Postal Code\n");
	writeCartCellPost();
	document.write("</tr>\n");

	document.write("<tr>\n");
	writeCartCellPre("",3);
	document.write("<input type=\"text\" size=\"32\" name=\""+prefix+"country\"><BR>Country\n");
	writeCartCellPost();
	document.write("</tr>\n");
}

function displayCheckoutPage() {
	// this obtains the search portion of the URL
	var cart=getCart();

	if (cart.payby=="paypal")
		displayPaypalHandoffPage();
	else displayMailordForm();
}

function displayMailordForm() {
	var cart=getCart();
	displayStaticCart();
}

function displayDollars(qty) {
	document.write("$");
	document.write(qty.toFixed(2));
}
