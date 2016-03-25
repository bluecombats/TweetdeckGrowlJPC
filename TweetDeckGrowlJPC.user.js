// ==UserScript==
// @name          TweetDeck Growl JPC
// @namespace     http://www.bluecombats.blogspot.com
// @description	  Sends Growl notifications from the tweetdeck website when there is a new tweet, Number of columns gets registered with growl app
// @include       https://tweetdeck.twitter.com/*
// @version        1.81
//@date 2014-04-07
// ==/UserScript==

GrowlMonkey = function(){
    function fireGrowlEvent(type, data){
        var element = document.createElement("GrowlEventElement");
        element.setAttribute("data", JSON.stringify(data));
        document.documentElement.appendChild(element);

        var evt = document.createEvent("Events");
        evt.initEvent(type, true, false);
        element.dispatchEvent(evt);
    }
    
    return {
        register : function(appName, icon, notificationTypes){
            var r = {};
            r.appName = appName;
            r.icon = icon;
            r.notificationTypes = notificationTypes;
            fireGrowlEvent("GrowlRegister", r);
        },
        
        notify : function(appName, notificationType, title, text, icon){
            var n = {};
            n.appName = appName;
            n.type = notificationType;
            n.title = title;
            n.text = text;
            n.icon = icon;
            fireGrowlEvent("GrowlNotify", n);
        }
    }
}();

	try{
		function TweetdeckLoginScreen(){
			var moveon="no";
			while (moveon=="no"){
				//test
				console.log("nope");
				if(!document.getElementsByClassName('js-app-loading')[0].getElementsByClassName('js-startflow-chrome app-masthead')[0]){
					console.log("moving on");
					moveon="yes";
				}
			}
		}
		function TweetDeckColumns(){
	       var Var="exist";
	       var i=0;
			while (Var=="exist"){	
				if(document.getElementsByTagName("section")[i]){
					i+=1;
					console.log("Column "+i+" exists");
				}
				else{
					Var="doesn't exist";
				}	
			}
	       columns=i;
	       return [columns];
	   }
        function TweetDeckGrowlinit(appname,Columns){
            console.log('Starting TweetDeck Growl');
            
            var j;
            var ntNewTweet = {};
            var types=new Array();
            for(var i=1;i<=Columns;i++){
                j=i-1;
                ntNewTweet["Column"+i]={};
                ntNewTweet["Column"+i].name='column'+i+'NewTweet';
                ntNewTweet["Column"+i].displayName = 'Column '+i+' New Tweet';
                ntNewTweet["Column"+i].enabled = true;

                types [j]= ntNewTweet["Column"+i];
                //console.log("registering column"+i);
            }
            //console.log(types);
            GrowlMonkey.register(appname, "https://pbs.twimg.com/profile_images/3759540932/051e36e98a2b3776061fa6f611f5dcb0.png", types);
        }
        function defaultValues(oldtweet,tweet,Columns){
			var j;
            for(var i=1;i<=Columns;i++){
				j=i-1;
                oldtweet[j]="Dinosaur walks into a bar";
                tweet[j]="Dinosaur walks into a bar";
            }
            return [oldtweet,tweet];
        }
        function TweetDeckinterval(oldtweet,tweet,appname,Columns){
            var j,i;
			var column,TweetContainer, article, user;
			var ColumnHeader,ColumnHeaderAccount,account=null,image=null,retweeter="";
            // multiple columns
            for(i=1;i<=Columns;i++){
                j=i-1;
				account=null;
				retweeter="";
				
                console.log('Column '+i);
                oldtweet[j]=tweet[j];
				//default
				tweet[j]=null;
				
                //columns
               column=document.getElementsByTagName('section')[i];
               //console.log('column found');			   
			   article=column.getElementsByTagName('article')[0];
			   user=article.getElementsByClassName("nbfc")[0].innerHTML;
			   tweet[j]=article.getElementsByTagName("p")[0].innerHTML;
			   image=article.getElementsByTagName("img")[0].src;
                
				user=removeHtml(user);
               tweet[j]=removeHtml(tweet[j]);
                               
               if(oldtweet[j]!=tweet[j]){
					//GrowlMonkey.notify("APPLICATION NAME", "NOTIFICATION TYPE", "TITLE", "TEXT", "ICON URL");
					console.log("column"+i+"NewTweet");
					GrowlMonkey.notify(appname,"column"+i+"NewTweet",account,retweeter+"\n\n"+tweet[j]+"\n\n("+i+")"+ColumnHeader+" "+ColumnHeaderAccount,image);
				}
                else{
                        console.log('no new tweet');
                }
            }
            return [oldtweet,tweet];
        }
        function removeHtml(string){
            //find 1st occurence of <
            var lessthan=string.indexOf("<");
            while(lessthan!=-1){
                //console.log("check: "+tweet);
                //find 1st occurence of >
                var greaterthan=string.indexOf(">");
                //the html stuff
                var htmlstuff=string.substring(lessthan,greaterthan+1);
                //replacing html with nothing
                string=string.replace(htmlstuff,"");
                //update lessthan
                lessthan=string.indexOf("<");
            }
            //console.log("end of if statements");
            return string;
        }
        function removeHtmlEntities(string){
            var entitiesNumbers=["&#34;","&#39;","&#38;","&#60;","&#62;","&#160;","&#161;","&#162;","&#163;","&#164;",
            "&#165;","&#166;","&#167;","&#168;","&#169;","&#170;","&#171;","&#172;","&#173;","&#174;",
            "&#175;","&#176;","&#177;","&#178;","&#179;","&#180;","&#181;","&#182;","&#183;","&#184;",
            "&#185;","&#186;","&#187;","&#188;","&#189;","&#190;","&#191;","&#215;","&#247;"];
			var entitiesName=["&quot;","&apos;","&amp;","&lt;","&gt;","&nbsp;","&iexcl;","&cent;","&pound;","&curren;",
			"&yen;","&brvbar;","&sect;","&uml;","&copy;","&ordf;","&laquo;","&not;","&shy;","&reg;",
			"&macr;","&deg;","&plusmn;","&sup2;","&sup3;","&acute;","&micro;","&para;","&middot;","&cedil;",
			"&sup1;","&ordm;","&raquo;","&frac14;","&frac12;","&frac34;","&iquest;","&times;","&divide;"];
            var character=["\"","'","&","<",">"," ","¡","¢","£","¤",
            "¥","¦","§","¨","©","ª","«","¬","?­","®",
            "¯","°","±","²","³","´","µ","¶","·","¸",
            "¹","º","»","¼","½","¾","¿","×","÷"];
            var replace="yes";
            while(replace=="yes"){
                //replace
                for(var i=0;i<entitiesNumbers.length;i++){
                    var Number=string.indexOf(entitiesNumbers[i]);
					var Name=string.indexOf(entitiesName[i]);
                    if(Number!=-1){
                        string=string.replace(entitiesNumbers[i],character[i]);
                    }
					if(Name!=-1){
                        string=string.replace(entitiesName[i],character[i]);
					}
                }
                replace="no";
                //check if there is more replacements
                for(var i=0;i<entitiesNumbers.length;i++){
                    var Number=string.indexOf(entitiesNumbers[i]);
					var Name=string.indexOf(entitiesName[i]);
                    if(Number!=-1){
                        replace="yes";
                    }
					if(Name!=-1){
                        replace="yes";
					}
                }
            }
            return string;
        }
        function destroyGrowl(){
            var growlexist="exist";
            while( growlexist=="exist"){
                if(document.getElementsByTagName("growleventelement")[0]){
                    growlexist="exist";
                    var parent=document.getElementsByTagName("html")[0];
                    var child=document.getElementsByTagName("growleventelement")[0];
                    parent.removeChild(child);
                }
                else{
                    //doesn't exist
                    growlexist=" doesn't exist";
                }
            }
        }
        
        
        //Main Script starts here
        console.log("Starting TweetDeck Growl JPC")
        setTimeout(function(){
			var GroupVar,Columns,k,once="no",second="no";
            var appname= 'TweetDeck Growl';
			//find out if it's on the login screen
			//TweetdeckLoginScreen();
			var variable=setInterval(function(){
				if(!document.getElementsByClassName('js-app-loading')[0].getElementsByClassName('js-startflow-chrome app-masthead')[0]){
					//clearInterval(variable);
					console.log("continue");
					
					if(second=="no"){
						second="yes";
						//find out how many columns there are
						GroupVar=TweetDeckColumns();
						Columns=GroupVar[0];
						TweetDeckGrowlinit(appname,Columns);
						tweet={};
						oldtweet={};
						var Myvar=defaultValues(oldtweet,tweet,Columns);
						oldtweet=Myvar[0];
						tweet=Myvar[1];
					}					
					Myvar=TweetDeckinterval(oldtweet,tweet,appname,Columns);
					oldtweet=Myvar[0];
					tweet=Myvar[1];
					destroyGrowl();
				}
				else{
					console.log("still on log on screen");
				}
			},1000);
            //find out how many columns there are
            /*GroupVar=TweetDeckColumns();
			Columns=GroupVar[0];
			k=GroupVar[1];
            TweetDeckGrowlinit(appname,Columns);
            tweet={};
            oldtweet={};
            var Myvar=defaultValues(oldtweet,tweet,Columns);
            oldtweet=Myvar[0];
            tweet=Myvar[1];
            setInterval(function(){
                Myvar=TweetDeckinterval(oldtweet,tweet,appname,Columns,k);
                oldtweet=Myvar[0];
                tweet=Myvar[1];
                destroyGrowl();
            },2000);*/            
        },10000);
    }
    catch(err){
        txt="There was an error on this page.\n";   
        txt+="Error description: " + err.message + "\n"; 
        txt+="Error line "+err.lineNumber+ "\n";
        txt+="Click OK to continue.\n";   
        console.log(txt);
    }
    console.log("end of loop");