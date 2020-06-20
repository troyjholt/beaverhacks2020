function category_cross_out_implementation(pool, app, rand) {

    /* This GET request handles loading the category-cross-out game. */
    app.get('/category_cross_out', function (request, response, next) {

        let context = {};

        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client.', err.stack)
            }

            context.score = 0;

            client.query('SELECT rownumber, name FROM (SELECT ROW_NUMBER() OVER (ORDER BY (SELECT 0)) as rownumber, name FROM (SELECT name FROM category ORDER BY random()) AS randomized) AS selection WHERE rownumber <= 2;', (err, result) => {
                /* Skips to the 500 page is an error is returned.*/
                if (err) {
                    next(err);
                    return console.error('Error executing query', err.stack);
                }

                context.wrong_position = rand(3) + 1;
                context.category_correct = result.rows[0].name;
                context.category_wrong = result.rows[1].name;

                client.query('SELECT name, URL, difficulty FROM (SELECT ROW_NUMBER() OVER (ORDER BY (SELECT 0)) AS rownumber, name, URL, difficulty FROM (SELECT words.name, URL, difficulty from category INNER JOIN words ON category_id=type where category.name=$1 ORDER BY random()) AS randomized) AS selection WHERE rownumber <= 3;', [context.category_correct], (err, result) => {
                    release()
                    /* Skips to the 500 page is an error is returned.*/
                    if (err) {
                        next(err);
                        return console.error('Error executing query', err.stack);
                    }

                    context.correct = result.rows;
                    context.correctstring = JSON.stringify(result.rows);

                    response.render('category_cross_out', context);
                })
            })
        });
    });
}

/*Modules is a special object which holds the exports dictionary.
* Exports is a dictionary provided automatically by node.js that
* has the keys which are the names of things in the module that
* can be used and the values are the actual value/implementation
* of those things.*/
module.exports.category_cross_out = category_cross_out_implementation;
