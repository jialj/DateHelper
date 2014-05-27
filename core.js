var Util = {
	extend:function(){
		var args = this.arralize(arguments),
			has = Object.prototype.hasOwnProperty,
		    first = args.shift(),
		    deep = false,
		    target = first,
		    next = null,
		    key,
		    val;
		if(typeof first === "boolean" && first){
		    deep = first;
		    target = args.shift();
		}
		target = target || {};
		while(args.length){
			next = args.shift();
			if(this.is(next,"object")){
				for(key in next){
	    			if(has.call(next,key)){
	    				val = next[key];
	    				if(deep && is(val,"object")){
	    				    extend(deep,target[key],val);	
	    				}else{
	    					target[key] = next[key];
	    				}
	    			}
	    		}
			}
		}
		return target;
	},
	arralize:function(arraylike){
		return Array.prototype.slice.call(arraylike);
	},
	is:function(obj,type){
		return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase() === type;
	},
	str_repeat:function(char,times){
		var ret = '';
		while(times-- > 0){
			ret += char;
		}
		return ret;
	},
	sprintf:function(format,arg1){
		var arralize =  Util.arralize,
			str_repeat = Util.str_repeat,
			meta_rule = /\%\%/g,
			format_rule = /\%('.|0|\s)?(\-?)(\d*)(\.\d*)?([A-z])/g,
			match = '',
			loop = 0,
			holders = [],
			params = arralize(arguments),
			result = params.shift();
		function translate(type,str,padding,direction,total,floats){
			var ret = '',
				padChar = typeof padding != "undefined" && padding.length > 0?padding.replace(/^'/,""):"",
				dotLen = floats?parseInt(floats.substr(1),10):0,
				total = total || 0,
				str = str + "",
				strLen = str.length;
			switch(type){
				case "d":
				ret = str;
				if(strLen < total && padChar.length){
					ret = str_repeat(padChar,total-strLen) + ret;
				}
				break;
				case "f":
				ret = str;
				if(dotLen){
					if(str.indexOf(".") > -1){
						var segs = str.split("."),
							dots = segs[1];
						if(dots.length > dotLen){
							ret = segs[0] + "." + Math.round(dots.substr(0,dotLen+1)/10); 
						}else{
							ret = segs[0] + "." + segs[1] + str_repeat("0",dotLen-dots.length);
						}
					}else{
						ret = ret + "." + str_repeat("0",dotLen);
					}
				}
				if(total && ret.length < total && padChar.length){
					var combine = str_repeat(padChar,total-ret.length);
					if(direction){
						ret += combine;
					}else{
						ret = combine + ret;
					}
				}
				break;
				default:
				ret = '';
			}
			return ret;
		}
		while(meta_rule.exec(format)){
			holders.push(meta_rule.lastIndex-2);
			holders.push(meta_rule.lastIndex-1);
		}
		return result.replace(format_rule,function() {
			var args = arralize(arguments),
				input = args.pop(),
				lastIndex = args.pop(),
				type = args.pop(),
				match = args.shift(),
				startIndex = lastIndex - match.length + 1;
			if((","+holders.join(",")+",").indexOf(","+startIndex+",")>0){
				return match;
			}else{
				return translate.apply(null,[type,params[loop++]].concat(args));
			}
		}).replace(meta_rule,"%");
	}
};