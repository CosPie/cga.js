#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
  
git add -A
# git add .
git commit -m 'xtorcga' 

git push origin master 

cnpm sync xtorcga