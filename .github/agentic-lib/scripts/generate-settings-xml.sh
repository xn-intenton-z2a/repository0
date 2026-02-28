#!/usr/bin/env bash
# Purpose: Generate an ~/.m2/settings.xml file with the PERSONAL_ACCESS_TOKEN secret.
# Usage: ./scripts/generate-settings-xml.sh
rm -f ~/.m2/settings.xml
source secrets.env
echo "<settings>" > ~/.m2/settings.xml
echo "  <servers>" >> ~/.m2/settings.xml
echo "    <server>" >> ~/.m2/settings.xml
echo "      <id>github</id>" >> ~/.m2/settings.xml
echo "      <username>Antony-at-Polycode</username>" >> ~/.m2/settings.xml
echo "      <password>${PERSONAL_ACCESS_TOKEN?}</password>" >> ~/.m2/settings.xml
echo "    </server>" >> ~/.m2/settings.xml
echo "  </servers>" >> ~/.m2/settings.xml
echo "</settings>" >> ~/.m2/settings.xml
