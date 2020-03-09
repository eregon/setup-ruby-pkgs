'use strict';

const core = require('@actions/core')

const { execSync } = require('./common')

// clean inputs
let apt = core.getInput('apt-get').replace(/[^a-z_ \d.-]+/gi, '').trim().toLowerCase()

export const run = async () => {
  try {
    // normal Actions TEMP/TMP settings use a short file pathname
    // unexpected errors may ocurr...
    core.exportVariable('TMPDIR', process.env.RUNNER_TEMP)
    
    if (apt !== '') {
      if (apt.includes('_update_')) {
        execSync('sudo apt-get -qy update')
        apt = apt.replace(/_update_/gi, '').trim()
      }
      
      if (apt.includes('_upgrade_')) {
        execSync('sudo apt-get -qy update')
        execSync('sudo apt-get -qy dist-upgrade')
        apt = apt.replace(/_upgrade_/gi, '').trim()
      }

      if (apt !== '') {
        execSync(`sudo apt-get -qy --no-install-recommends install ${apt}`)
      }
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}