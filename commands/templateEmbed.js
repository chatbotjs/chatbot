exports.run = (client, templateCode, message, args) => {
	
	templateCode = templateCode.slice(1)		
	
	let displayLang = "cn"
	let pvp = false
	let address = "https://guildwars.huijiwiki.com/wiki/j?"
	
	if ((templateCode.indexOf("!") == 0) || (templateCode.indexOf("！") == 0)) {
		templateCode = templateCode.slice(1)		
		pvp = true
	}

	if (templateCode.match(/^[A-Za-z0-9\+\/]+$/)){
		
		let bin = codetobin(templateCode);
		if(bin.substr(0, 4) == '0111') bin = bin.substr(4);
		
		if((bin.length < 23) || (bin.substr(0, 6) != '000000')){
			message.channel.send("编码格式有误\n(improper template code)").catch(console.error);
			return;
		}
		
		bin = bin.substr(6);
		let primaryProf = binval(bin.substr(0, 4))
		let secondaryProf = binval(bin.substr(4, 4))
		let profEntry = ""
		
		if ((args[0] && args[0].toLowerCase()=="cn") || authorHasRole(msg, "中文")){
			
			profEntry = (profNameCn(secondaryProf)) ? profNameCn(primaryProf) + " | " + profNameCn(secondaryProf) : profNameCn(primaryProf)
			address = (pvp) ? "[图解➻]("+address+"y?"+templateCode+")" : "[图解➻]("+address+templateCode+")"
			
		} else if ((args[0] && args[0].toLowerCase()=="en") || authorHasRole(msg, "外文")){
			
			profEntry = (profNameEn(secondaryProf)) ? profNameEn(primaryProf) + " | " + profNameEn(secondaryProf) : profNameEn(primaryProf)
			address = (pvp) ? "[iconView➻]("+address+"h?"+templateCode+")" : "[iconView➻]("+address+"e?"+templateCode+")"
			
		}
			
		let embedTemplate = new Discord.RichEmbed()
			.setColor(getRandomColor()) //.setAuthor("Author Name", null, "https://")		
			.setDescription(profEntry)
			.addField(templateCode,address)
					
		message.channel.send(embedTemplate).catch(console.error);
		
	}
}

function profNameCn(input){
	switch(input){
		case 0:
			return null
		case 1:
			return "[战士](https://guildwars.huijiwiki.com/wiki/战士技能)"
		case 2: 
			return "[游侠](https://guildwars.huijiwiki.com/wiki/游侠技能)"
		case 3: 
			return "[僧侣](https://guildwars.huijiwiki.com/wiki/僧侣技能)"
		case 4: 
			return "[死灵](https://guildwars.huijiwiki.com/wiki/死灵技能)"
		case 5: 
			return "[幻术](https://guildwars.huijiwiki.com/wiki/幻术技能)"
		case 6: 
			return "[元素](https://guildwars.huijiwiki.com/wiki/元素技能)"
		case 7: 
			return "[暗杀](https://guildwars.huijiwiki.com/wiki/暗杀技能)"
		case 8: 
			return "[祭祀](https://guildwars.huijiwiki.com/wiki/祭祀技能)"
		case 9: 
			return "[圣言](https://guildwars.huijiwiki.com/wiki/圣言技能)"
		case 10: 
			return "[神唤](https://guildwars.huijiwiki.com/wiki/神唤技能)"
		default:
			return null
	}		
}

function profNameEn(input){
	switch(input){
		case 0:
			return null
		case 1:
			return "[Warrior](https://wiki.guildwars.com/wiki/List_of_warrior_skills)"
		case 2: 
			return "[Ranger](https://wiki.guildwars.com/wiki/List_of_ranger_skills)"
		case 3: 
			return "[Monk](https://wiki.guildwars.com/wiki/List_of_monk_skills)"
		case 4: 
			return "[Necromancer](https://wiki.guildwars.com/wiki/List_of_necromancer_skills)"
		case 5: 
			return "[Mesmer](https://wiki.guildwars.com/wiki/List_of_mesmer_skills)"
		case 6: 
			return "[Elementalist](https://wiki.guildwars.com/wiki/List_of_elementalist_skills)"
		case 7: 
			return "[Assassin](https://wiki.guildwars.com/wiki/List_of_assassin_skills)"
		case 8: 
			return "[Ritualist](https://wiki.guildwars.com/wiki/List_of_ritualist_skills)"
		case 9: 
			return "[Paragon](https://wiki.guildwars.com/wiki/List_of_paragon_skills)"
		case 10: 
			return "[Dervish](https://wiki.guildwars.com/wiki/List_of_dervish_skills)"
		default:
			return null
	}
}
function getRandomColor() {
  let letters = '0123456789ABCDEF';  
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += letters.charAt(Math.floor(Math.random() * 16));
  }
  return "0x"+result;
}

function binval(b) {
	return parseInt(strrev(b), 2);
}

function strrev(s) {
	return (s || '').split('').reverse().join('');
}

function charindex(c) {
	let _base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	let n = _base64.length;
	for(let i = 0; i < n; i++) if(_base64.substr(i, 1) == c) return i;
}

function binpadright(s, n) {
	while(s.length < n) s += '0';
	return s;
}

function valbin(v, n) {
	return binpadright(strrev(parseInt(v).toString(2)), n);
}

function codetobin(c) {
	let n = c.length, bin = '';
	for(let i = 0; i < n; i++){
		bin += valbin(charindex(c.substr(i, 1)), 6);
	}
	return bin;
}