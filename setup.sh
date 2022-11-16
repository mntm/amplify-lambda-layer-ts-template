#!/usr/bin/env bash

read -p "Is this directory inside an Amplify project? (y/n) " yn

case $yn in 
	[yY] ) ;;
	[nN] ) echo exiting...;
		exit;;
	* ) echo invalid response;
		exit 1;;
esac

read -p "Is this directory a NodeJs Lambda function layer directory? (y/n) " yn

case $yn in 
	[yY] ) ;;
	[nN] ) echo exiting...;
		exit;;
	* ) echo invalid response;
		exit 1;;
esac

[ -z $* ] && echo "$0 <PKGNAME>" && exit 1

__LN=${PWD##*/}
__PN=$1
__RX=`head -c 32 /dev/urandom | md5sum | cut -c1-7`

rm -rf .git

mv "__LAYER_NAME-awscloudformation-template.json" "$__LN-awscloudformation-template.json"

grep -r -e "__LAYER_NAME" -e "__PKG_NAME" -e "__RND_HEX" --exclude="setup.sh" --exclude="node_modules" | cut -f1 -d: | uniq | xargs sed -i "s/__LAYER_NAME/$__LN/; s/__PKG_NAME/$__PN/; s/__RND_HEX/$__RX/" 

rm $0