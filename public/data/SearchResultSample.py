# -*- coding: UTF-8 -*-
from django.urls import path
from django.http import JsonResponse
import json
#from django.views.decorators.csrf import csrf_exempt
#@csrf_exempt
def samples(a):
	r=[]
	for i in range(10,407):
		r.append({
			'key': i,
			'id': i,
			'authors': 'Edward King '+str(i),
			'time': 32+0.1*i,
			'title': 'London, Park Lane no. '+str(i),
			'abstract': 'Hello, world!\
It is 下午6:02:30.\
Hello, world!\
It is 下午6:02:30.\
Hello, world!\
It is 下午6:02:30.'+str(i),
			'tags': [i+1,i+2,i-5],
			'type': 'paper' if i % 2 else 'discussion',
		})
	response=JsonResponse(r,safe=False)
	response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
	return response

urlpatterns = [
    path('papers/', samples),
]
