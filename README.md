First time setup:

1. Install Docker Desktop and make sure it's running (if you're on Windows you'll likely need to install WSL 2 first)
2. Run `docker compose up` to run the stuff in `docker-compose.yml`
3. Go to `localhost:4000` to see the Firebase Emulator page, here you can confirm that data is getting saved
4. Go to `localhost:3000` to see the Grafana page
5. In the sidebar, go to Connections and press Add new connection
6. Choose InfluxDB as the data source, then click Add new data source
7. Set the HTTP URL to "http://host.docker.internal:8086"
8. Set the Database to "k6" and the HTTP Method to POST
9. Press Save & test to confirm it's working
10. In the sidebar, go to Dashboards and create a new dashboard
11. Click Import dashboard
12. Load the ID 2587 (corresponds to this dashboard: https://grafana.com/grafana/dashboards/2587-k6-load-testing-results)
13. Set the InfluxDB data source to the influxdb from step 5
14. Save and go to the dashboard
15. Edit the Errors Per Second panel and in the Queries tab, click the pencil icon to switch to raw SQL and enter in `SELECT count("value") FROM "http_req_failed" WHERE ("value"::field = 1) AND $timeFilter GROUP BY time($__interval) fill(none)`, then save and return to the dashboard
16. In the terminal, run `docker compose run --rm k6 run /k6/registerAndChat.js`
17. Hopefully the test runs successfully and you see changes in the dashboard

The simulated hardware limits are set in the docker-compose.yml, see the `mem_limit` and `cpus` fields

To view Memory Usage and CPU usage in grafana

1. Go to `localhost:3000` to see the Grafana page
2. Add a new data source, choose prometheus and set the URL to http://prometheus:9090 and click Save & Test.
3. Open the k6 Load Testing Results click edit on the top right, open the "add" dropdown, click on add visualization
4. In the open queries tab select prometheus as the data source and open the "code" panel
5. For memory usage stats enter the following as the metric:
   (container_memory_usage_bytes{name="firebase-emulator"}
   /container_spec_memory_limit_bytes{name="firebase-emulator"}) \* 100
   and click save dashboard
6. For data usage repeat steps 3 and 4 then enter the following as the metric:
   sum(rate(container_cpu_usage_seconds_total{name="firebase-emulator"}[1m]))
   /count(container_cpu_usage_seconds_total{name="firebase-emulator"})\*100
   and click save dashboard
7. Run the tests as usual

NOTE: If you change the hardware parameters make sure you run the following instructions
docker-compose down
docker container prune
docker compose up
