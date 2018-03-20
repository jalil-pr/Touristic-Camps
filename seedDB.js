var mongoose=require("mongoose");
var campgrounds =require("./models/campground.js");
var Comments    =require("./models/comment.js");



var data=[

   {
   	name:"Bamyan",
   	url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUB1Qnnv7dqpAHGMdOIIGveYTeFeI0ZKqRj4AGpnreTA22NrBn",
   	desc:"this is the bamyan valley"

   },
   {
   	name:"Mazar",
   	url:"https://www.zamnesia.com/img/cms/Blog/Strain%20Reviews/Mazar/Mazar.jpg",
   	desc:"you are my love"

   },
   {
   	name:"Herat",
   	url:"https://www.chasingtheunexpected.com/wp-content/uploads/2017/02/thigs-to-do-in-herat-masjid-jame-min.jpg",
   	desc:"you are my jaan!"

   }

];

function seedDb()
{
	campgrounds.remove({},function(err)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log("removed all the camps");
			Comments.remove({},function(err)
			{
				if(err)
				{
					console.log(err);
				}
                console.log("removed all the comments");
				data.forEach(function(camp)
				{
					campgrounds.create(camp,function(err,createdCamp)
					{
						if(err)
						{
							console.log(err);
						}
						else
						{
							console.log("created a camp");
							Comments.create({
								text:"this is the greatest place ...",
								author:"jalil"
							},function(err,comment)
							{
								if(err)
								{
									console.log(err);
								}
								else
								{
									console.log("created a comment");
									createdCamp.comments.push(comment._id);
									createdCamp.save();

								}
							});

						}
					}

					)

				});
				
			})

		}
	})
}


module.exports=seedDb;
