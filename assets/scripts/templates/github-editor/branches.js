define(["jade"],function(a){return a&&void 0!==a.runtime&&(a=a.runtime),function(b){var c,d=[],e={},f=b||{};return function(b,f,g){e["box-body"]=function(b){var c=this&&this.block,e=this&&this.attributes||{};if(b=b||!1){var f="height: "+b+"px;";d.push("<section"+a.attrs(a.merge([{style:a.escape(a.style(f)),"class":"scrollable"},e]),!1)+">"),c&&c(),d.push("</section>")}else d.push("<section"+a.attrs(a.merge([e]),!1)+">"),c&&c(),d.push("</section>")},e.box=function(b,f,g,h){var i=this&&this.block,j=this&&this.attributes||{};f=f||!1,b=b||!1,h=h||"",b?(d.push("<div"+a.cls(["box","box-style-light",h],[null,null,!0])+"><header>"),f&&d.push("<i"+a.cls(["fa fa-"+f],[!0])+"></i>"),d.push("<h3>"+a.escape(null==(c=b)?"":c)+"</h3></header>"),e["box-body"].call({block:function(){i&&i()},attributes:a.merge([j])},g),d.push("</div>")):(d.push("<div"+a.attrs(a.merge([{"class":"box box-style-light"},j]),!1)+">"),i&&i(),d.push("</div>"))},e.box.call({block:function(){(function(){var e=f;if("number"==typeof e.length)for(var h=0,i=e.length;i>h;h++){var j=e[h],k=b.isObject(g.owner)?g.owner.login:g.owner;d.push('<a href="#"'+a.attr("data-owner",k,!0,!1)+a.attr("data-repo",g.name,!0,!1)+a.attr("data-branch",j,!0,!1)+' class="btn btn-block btn-primary no-margin-top">'+a.escape(null==(c=j)?"":c)+"</a>")}else{var i=0;for(var h in e){i++;var j=e[h],k=b.isObject(g.owner)?g.owner.login:g.owner;d.push('<a href="#"'+a.attr("data-owner",k,!0,!1)+a.attr("data-repo",g.name,!0,!1)+a.attr("data-branch",j,!0,!1)+' class="btn btn-block btn-primary no-margin-top">'+a.escape(null==(c=j)?"":c)+"</a>")}}}).call(this)}},"Branches")}.call(this,"_"in f?f._:"undefined"!=typeof _?_:void 0,"branches"in f?f.branches:"undefined"!=typeof branches?branches:void 0,"repo"in f?f.repo:"undefined"!=typeof repo?repo:void 0),d.join("")}});