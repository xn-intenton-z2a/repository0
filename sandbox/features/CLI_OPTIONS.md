# Overview
This feature enhances the command line interface by adding support for common flags such as --help and --version. These flags give users guidance on how to use the program and display version information taken from the package.json file. The feature is designed to improve user interaction and understanding of the repository functionality.

# Implementation Details
The main source file will be updated to parse the command line arguments. If the user includes the --help flag, the program will output usage information that explains the available commands. If the --version flag is detected, the program will display the current version of the repository according to the dependencies file. In the event of unrecognized flags, an appropriate message will be printed.

# Testing
Unit tests will be added to validate the following:
- Correct output for the --help flag
- Correct version information is printed when using the --version flag
- Stability of the main functionality when no flags are provided

# Documentation
The README file will be updated to include sections on CLI usage, describing the newly added flags and providing examples of how to run the main script with these options. The feature ties directly into the mission of the repository by enhancing the interactivity and discoverability of its core functionalities.