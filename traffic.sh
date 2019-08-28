#!/bin/bash

trap ctrl_c INT

function ctrl_c() {
  echo "Deleting pod"
  kubectl delete pods csh-test-summary-metric
  exit
}

echo "Creating pod"

kubectl run csh-test-summary-metric --image=mans0954/testsummarymetric --restart=Never
kubectl annotate pods csh-test-summary-metric prometheus.io/port=3000
kubectl annotate pods csh-test-summary-metric prometheus.io/scrape=true

echo "Waiting for pod to be ready"
sleep 20s

kubectl port-forward csh-test-summary-metric 3000:3000 &

echo "Generating traffic, press Ctrl-C to stop"

while true; do
  curl http://localhost:3000/
  sleep $[ ( $RANDOM % 10 )  + 1 ]s
done
