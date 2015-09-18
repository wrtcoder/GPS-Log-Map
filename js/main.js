$('document').ready(function(){
    console.log('ready');

    var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:-26.034844, lng: 28.018817},
        zoom: 16,
        mapTypeControl: true,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.HYBRID
      });
    }

    function ConvertDMSToDD(dms, direction) {
        var c = dms.split('.');
        if (c[0].length == 5) {
            var degrees = c[0].substr(1,2);
            var minutes = c[0].substr(3,4);
            var seconds = Math.round(c[1]);
        } else if (c[0].length == 4) {
            var degrees = c[0].substr(0,2);
            var minutes = c[0].substr(2,4);
            var seconds = c[1];
        } else {
            console.log('?');
        }

        if (direction == "S" || direction == "W") {
            dd = Math.round(degrees + (minutes) + (seconds) ) * -1/1000000;
        } else {
            dd = Math.round(degrees + (minutes) + (seconds) ) * 1/1000000;
        }

        return dd;
    }


    $.get('data/GPSLOG01.TXT', function(data){
        initMap();
        var polylineCoordinates = [];

        var md = data.split('\n');

        $.each(md, function(n){
            var pd = md[n].split(',');

            switch (pd[0]) {
                case '$GPRMC':
                    // Recommended minimum specific GPS/Transit data
                    if (pd[6] == '1') {
                        // Valid GPS Data
                        var lat = ConvertDMSToDD(pd[2],pd[3]);
                        var long = ConvertDMSToDD(pd[4],pd[5]);

                        polylineCoordinates.push( new google.maps.LatLng(lat,long) );
                    }
                    break;
                case '$GPGGA':
                    // Global Positioning System Fix Data
                    if (pd[6] == '1') {
                        // Valid GPS Data
                        var lat = ConvertDMSToDD(pd[2],pd[3]);
                        var long = ConvertDMSToDD(pd[4],pd[5]);

                        polylineCoordinates.push( new google.maps.LatLng(lat,long) );
                    }
                    break;
            }

            // $.each(pd, function(s){
            //     if (n == 501) {
            //         console.log(pd[s]);
            //     }
            // });

            // console.log(md[n]);
        });

        console.log(polylineCoordinates);

        var polyline = new google.maps.Polyline({
          path: polylineCoordinates,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          editable: true
      });

      polyline.setMap(map);
    });;
});