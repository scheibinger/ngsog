#!/bin/bash

if [ $# -ne 2 ]
then
        echo "two arguments expected."
        echo "create_album.sh srcPath albumName"
        exit 1
fi

albumPath="../app/images/ngsog/$2";
mkdir $albumPath;
rm "$albumPath/content.html";
touch "$albumPath/content.html";
echo "<h3 class=\"link\">$2</h3>" >> "$albumPath/content.html";
echo "<div class=\"gallery\">" >> "$albumPath/content.html";
#for file in *.png; do convert $file -resize 750 rotated-$file; done
echo "$1";
i=0;
for file in $1*; do
	((i++));
	echo $file;
	baseFileName=$(basename ${file})
	filenameNoExtension="${baseFileName%.*}"
	imgPath="$albumPath/$filenameNoExtension.jpg";
	echo "creating $imgPath";
	thumbPath="$albumPath/${filenameNoExtension}_thumb.jpg";
	convert $file -resize x900 $imgPath;
	echo "creating $thumbPath";
	#convert $file -resize x111 $thumbPath;
	convert $file -resize "200x133^" -gravity center -crop 200x133+0+0 +repage $thumbPath;
	echo "<a href=\"/images/ngsog/$2/$filenameNoExtension.jpg\"> <img src=\"/images/ngsog/$2/${filenameNoExtension}_thumb.jpg\" alt=\"${filenameNoExtension}\" /> </a>"  >> "$albumPath/content.html";
done
echo "</div><script type=\"text/javascript\">\$(function() {\$('#gallery a').lightBox();});</script>" >> "$albumPath/content.html";
