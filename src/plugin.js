import videojs from 'video.js';

// Default options for the plugin.
const defaults = {};

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onPlayerReady = (player, options) => {

	var adverts = options.body;
	var firePlayThroughOnce = true;
	var currentVideo = player.currentSrc();
	var progressBarHolder = document.getElementsByClassName("vjs-progress-holder")[0];
	var progressBar = document.getElementsByClassName("vjs-progress-control")[0];

	var skipButton = player.addChild('button');
    skipButton.el();
    skipButton.el().id = "s3bubble-skip-button";
    skipButton.el().style.width = "90px";
    skipButton.el().style.height = "35px";
	skipButton.el().style.position = "absolute";
	skipButton.el().style.bottom = "60px";
	skipButton.el().style.right = "-1px";
	skipButton.el().style.background = "black";
	skipButton.el().style.display = "none";
	skipButton.el().style.border = "1px solid white";
	skipButton.el().style.zIndex = "2";

    var skipButtonText = document.createElement('a');
	document.getElementById("s3bubble-skip-button").appendChild(skipButtonText);
	skipButtonText.innerHTML = "Skip";
	skipButtonText.style.fontSize = "14px";
    skipButtonText.style.fontWeight = "normal";
    skipButtonText.style.margin = "0px";
    skipButtonText.style.padding = "0px";
    skipButtonText.style.white = "white";

    skipButton.on('click', function(){

      resumeVideo();

    });

	// Sort the array
	adverts.sort(function(a, b){
	
	    return parseFloat(a.time) - parseFloat(b.time);
	
	});
	
	function search(idKey, myArray){
	  for (var i=0; i < myArray.length; i++) {
	    if (parseInt(myArray[i].time) === idKey) {
	      return {
	         data: myArray[i],
	         index : i
	      };
	    }
	  }
	}

	// Add the advertisement button
    var s3bubbleAdvertismentText = document.createElement('div');
    s3bubbleAdvertismentText.id = "advertisement";
    s3bubbleAdvertismentText.className = 'vjs-control line-height';
    s3bubbleAdvertismentText.style.width = "115px";
    s3bubbleAdvertismentText.style.lineHeight = "30px";
    s3bubbleAdvertismentText.style.display = "none";

    var s3bubbleAdvertismentLink = document.createElement('a');
    s3bubbleAdvertismentLink.className = 'vjs-control line-height';

    s3bubbleAdvertismentLink.setAttribute('href','');
    s3bubbleAdvertismentLink.setAttribute('target', '_blank');

    s3bubbleAdvertismentLink.addEventListener("click", function(){

    	var win = window.open(this.getAttribute("href"), "_blank");
        win.focus();
        event.preventDefault();

    });

    s3bubbleAdvertismentLink.innerHTML = "Advertisement";
    s3bubbleAdvertismentLink.style.color = "white";
    s3bubbleAdvertismentLink.style.textDecoration = "none";
    s3bubbleAdvertismentLink.style.fontSize = "12px";

    s3bubbleAdvertismentText.appendChild(s3bubbleAdvertismentLink);
    var controlBar = document.getElementsByClassName('vjs-control-bar')[0];
    var insertBeforeNode = document.getElementsByClassName("vjs-volume-menu-button")[0];
    controlBar.insertBefore(s3bubbleAdvertismentText,insertBeforeNode.nextSibling);

    player.on('timeupdate', function(){
                	
		var t = Math.round(player.currentTime());  
                    	
    	if(!player.advert_playing){
        	            	
			var resultObject = search(t, adverts);
			if(resultObject){

				playAdvert(resultObject.data);
				adverts.splice(resultObject.index, 1);

			}
		}
		var dur = Math.floor(player.duration());
		if (t === dur && dur != 0) {
            if(player.advert_playing){
            	resumeVideo();
            }
        }

	});

	var addAdvertsLinesOnce = true;
	player.on('loadedmetadata', function(event) {
		
		if(addAdvertsLinesOnce){
			
			var durd = Math.round(player.duration());

        	for (var i=0; i < adverts.length; i++) {
			    
			    var sliderLeft = Math.round(((100/durd) * parseInt(adverts[i].time)));

			    var s3bubbleAdvertismentTime = document.createElement('div');
			    s3bubbleAdvertismentTime.className = 'advert-time';
			    s3bubbleAdvertismentTime.style.position = "absolute";
			    s3bubbleAdvertismentTime.style.width = "5px";
			    s3bubbleAdvertismentTime.style.height = "100%";
			    s3bubbleAdvertismentTime.style.background = "#fff";
			    s3bubbleAdvertismentTime.style.left = sliderLeft + "%";
			    progressBarHolder.appendChild(s3bubbleAdvertismentTime);
				
			};
			
			addAdvertsLinesOnce = false;
		
		}
		
			if(!player.advert_playing){
				
				if(firePlayThroughOnce){

					player.currentTime(player.advert_last_time);
					firePlayThroughOnce = false;
					
				}
			
			}
		
    });

    var playAdvert = function(data){
        
        // update adverts ui
    	s3bubbleAdvertismentText.style.display = "block";
	    progressBar.style.height = "0px";
	    progressBar.style.overflow = "hidden";
	    if (document.getElementById("switch")){
		    document.getElementById("switch").style.display = "none";
		}

		// Set the current time
    	player.advert_playing = true;
    	player.advert_last_time = player.currentTime();
    	
		player.src({
			"src": data.url
		});
		
		player.currentTime(0);
		
		player.play();

    	// Hide ui buttons    	
    	var tracks = player.textTracks();

    	for (var i = 0; i < tracks.length; i++) {
		  var track = tracks[i];
		  if (track.kind === 'captions') {
		    	track.mode = 'hidden';
		  }
		}
		
		var skipIt = parseInt(data.skip);
		if(skipIt != "" || skipIt != 0){
			setTimeout(function(){

				skipButton.el().style.display = "block";

			},skipIt*1000);
		}
		
		var linkIt = data.link;
		if(linkIt != ""){

			s3bubbleAdvertismentLink.innerHTML = "Ad: More information";
			s3bubbleAdvertismentLink.setAttribute('href',linkIt);

		}

    } 

    //Advert functions
    var resumeVideo = function(){

        player.src({
			"src": currentVideo
		});
		
        firePlayThroughOnce = true;
        player.advert_playing = false;
		
		player.play();

		// update adverts ui
		skipButton.el().style.display = "none";
    	s3bubbleAdvertismentText.style.display = "none";
	    progressBar.style.height = "auto";
	    progressBar.style.overflow = "visible";

		if (document.getElementById("switch")){
		    document.getElementById("switch").style.display = "block";
		}
		
    }

};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function s3BubbleMultiAdverts
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const s3BubbleMultiAdverts = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('s3BubbleMultiAdverts', s3BubbleMultiAdverts);

// Include the version number.
s3BubbleMultiAdverts.VERSION = '__VERSION__';

export default s3BubbleMultiAdverts;
