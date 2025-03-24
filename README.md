First time setup:

1. Install Docker Desktop
2. Run `docker compose up` to run the stuff in `docker-compose.yml`
3. Go to `localhost:3000` to see the Grafana page
4. In the sidebar, go to Connections and press Add new connection
5. Choose InfluxDB as the data source, then click Add new data source
6. Set the HTTP URL to "http://host.docker.internal:8086"
7. Set the Database to "k6" and the HTTP Method to POST
8. Press Save & test to confirm it's working
9. In the sidebar, go to Dashboards and create a new dashboard
10. Click Import dashboard
11. Load the ID 2587
12. Set the InfluxDB data source to the influxdb from step 5
13. Save and go to the dashboard
14. In the terminal, run `docker compose run --rm k6 run --out influxdb=http://influxdb:8086/k6 /k6/registerAndChat.js`
15. Hopefully the test runs successfully and you see changes in the dashboard
