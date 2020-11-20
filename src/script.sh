#!/bin/bash
threadCount=$1
function find_files() {
    echo "thread count: $threadCount"
    files=()
    for line in $(find cypress/integration -type f -follow); do
        files+=("$line")
    done

    for i in "${files[@]}"
    do
        echo $i
    done
    filesCount=${#files[@]}
    remainder=$((filesCount % threadCount))
    quotient=$((filesCount / threadCount))
    # echo "$filesCount / $threadCount = $quotient"
    # echo "$filesCount % $threadCount = $remainder"
    commands=()
    if [[ "$remainder" == 0 ]]
        then
            for (( i=0; i<$filesCount; i+=$quotient ))
            do
                command="node_modules/.bin/cypress run --spec"
                for (( j=0; j<$quotient; j++ ))
                do
                    if [[ "$j" == 0 ]]
                    then
                        command="$command ${files[$i + $j]}"
                    else
                        command="$command,${files[$i + $j]}"
                    fi
                done
                commands+=("$command")
            done

    else
        for (( i=0; i<$filesCount - $remainder; i+=$quotient ))
        do
            command="node_modules/.bin/cypress run --spec"
            for (( j=0; j<$quotient; j++ ))
            do
                if [[ "$j" == 0 ]]
                then
                    command="$command ${files[$i + $j]}"
                else
                    command="$command,${files[$i + $j]}"
                fi
            done
            commands+=($command)
        done
        for (( k=$filesCount - $remainder; k<$filesCount; k++ ))
        do
            index=$((k - threadCount))
            commands[$index]="${commands[$index]} ${files[$k]},"
        done
    fi
}

# it seems it does not work well if using echo for function return value, and calling inside $() (is a subprocess spawned?)
function wait_and_get_exit_codes() {
    children=("$@")
    EXIT_CODE=0
    for job in "${children[@]}"; do
       echo "PID => ${job}"
       CODE=0;
       wait ${job} || CODE=$?
       if [[ "${CODE}" != "0" ]]; then
           echo "At least one test failed with exit code => ${CODE}" ;
           EXIT_CODE=1;
       fi
   done
}

DIRN=$(dirname "$0");

find_files

# commands=(
#     "node_modules/.bin/cypress run --spec cypress/integration/application.cy.ts,cypress/integration/main.cy.ts,cypress/integration/applications.cy.ts"
#     "node_modules/.bin/cypress run --spec cypress/integration/elaboration.cy.ts,cypress/integration/login.cy.ts,cypress/integration/application-edit.cy.ts"
#     )

echo ${commands[@]}

clen=`expr "${#commands[@]}" - 1` # get length of commands - 1

children_pids=()
for i in `seq 0 "$clen"`; do
    (echo "${commands[$i]}" | bash) &   # run the command via bash in subshell
    children_pids+=("$!")
    echo "$i ith command has been issued as a background job"
    echo "${commands[$i]}"
done
# wait; # wait for all subshells to finish - its still valid to wait for all jobs to finish, before processing any exit-codes if we wanted to
#EXIT_CODE=0;  # exit code of overall script
wait_and_get_exit_codes "${children_pids[@]}"

echo "EXIT_CODE => $EXIT_CODE"
exit "$EXIT_CODE"
# end
