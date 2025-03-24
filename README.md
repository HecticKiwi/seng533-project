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
15. In the terminal, run `docker compose run --rm k6 run --out influxdb=http://influxdb:8086/k6 /k6/registerAndChat.js`
16. Hopefully the test runs successfully and you see changes in the dashboard

The simulated hardware limits are set in the docker-compose.yml, see the `mem_limit` and `cpus` fields
