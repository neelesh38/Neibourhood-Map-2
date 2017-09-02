var locations = [{
        title: 'Park Ave Penthouse',
        location: {
            lat: 40.7713024,
            lng: -73.9632393,
        },
        show: true,
        selected: false,
        id: '4ce9ac41e888f04db250496b'
    },
    {
        title: 'Chelsea Loft',
        location: {
            lat: 40.7444883,
            lng: -73.9949465,
        },
        show: true,
        selected: false,
        id: '4d185869bb64224b39b0c665'
    },
    {
        title: 'Union Square Open Floor Plan',
        location: {
            lat: 40.7347062,
            lng: -73.9895759,
        },
        show: true,
        selected: false,
        id: '3fd66200f964a520def11ee3'
    },
    {
        title: 'East Village Hip Studio',
        location: {
            lat: 40.7281777,
            lng: -73.984377,
        },
        show: true,
        selected: false,
        id: '4f8c76d6e4b04a07616ddd3f'
    },
    {
        title: 'TriBeCa Artsy Bachelor Pad',
        location: {
            lat: 40.7195264,
            lng: -74.0089934,
        },
        show: true,
        selected: false,
        id: '4f8c76d6e4b04a07616ddd3f'
    },
    {
        title: 'Chinatown Homey Space',
        location: {
            lat: 40.7180628,
            lng: -73.9961237,
        },
        show: true,
        selected: false,
        id: '4dcff31745ddbe15f8adfb44'
    }
];

var markers = [];
var Model = function() {
    var largeInfowindow = new google.maps.InfoWindow();
    for (var i = 0; i < locations.length; i++) {
        var defaultIcon = makeMarkerIcon('0091ff');
        var highlightedIcon = makeMarkerIcon('FFFF24');
        var marker = new google.maps.Marker({
            map: map,
            position: locations[i].location,
            title: locations[i].title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            show: ko.observable(locations[i].show),
            selected: ko.observable(locations[i].selected),
            venue: locations[i].id,

        });
        likes: '';
        rating: '';
        markers.push(marker);

        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        //color change on click
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });

       marker.addListener('click',function(){
        drop(this);
      });
    }
    this.Bounce = function(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 750);
        populateInfoWindow(marker, largeInfowindow);
    };

    function drop(marker)
     {
       marker.setAnimation(google.maps.Animation.DROP);
       marker.setIcon(highlightedIcon);
       setTimeout(function() {
           marker.setAnimation(null);
           marker.setIcon(defaultIcon);
       }, 750);
       populateInfoWindow(marker, largeInfowindow);
     };
	 
    function populateInfoWindow(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
          if (status == google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(
              nearStreetViewLocation, marker.position);
              infowindow.setContent('<div>' + marker.title+'<br>'+marker.rating +'<br>'+marker.likes+'</div><div id="pano">+</div>');
              var panoramaOptions = {
                position: nearStreetViewLocation,
                pov: {
                  heading: heading,
                  pitch: 30
                }
              };
            var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('pano'), panoramaOptions);
          } else {
            infowindow.setContent('<div>' + marker.title + '</div>' +
              '<div>No Street View Found</div>');
          }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
      }
    }
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    };
	
	this.filterText = ko.observable('');
    this.filterList = function() {
        var text = this.filterText();
        largeInfowindow.close();
        if (text.length === 0) {
            this.setAllShow(true);
        } else {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].title.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                    markers[i].show(true);
                    markers[i].setVisible(true);
                } else {
                    markers[i].show(false);
                    markers[i].setVisible(false);
                }
            }
        }
        largeInfowindow.close();
    };
    this.setAllShow = function(marker) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].show(marker);
            markers[i].setVisible(marker);
        }
    };
	
    markers.forEach(function(marker) {
        $.ajax({
            method: 'GET',
            dataType: 'json',
            url: 'https://api.foursquare.com/v2/venues/' + marker.venue + '?client_id=ZNBWSBOKCVOK4KML4XW0XVSSPXXGLVP3UEPOQVHE1T5YSB1E&client_secret=F2CLYORZCNBNNDIUVZATCZQW5DRUWFQHMZFTP1JMN3K3143I&v=20170305',
            success: function(data) {
                var findsquare = data.response.venue;
                if (findsquare.hasOwnProperty('rating') === ''||findsquare.hasOwnProperty('rating')===undefined) {
                    marker.rating="Rating not Found";
                } else {
					marker.rating= findsquare.rating;
                }
                if (findsquare.hasOwnProperty('likes') ===''||findsquare.hasOwnProperty('likes') ===undefined) {
                    marker.likes = 'Likes Not Found';

                }
                else {
					marker.likes = findsquare.likes.summary;
                }

            },
            error: function(e) {
                alert("Error in foursquare");
            }
        });
    });
};
