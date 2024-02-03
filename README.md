# gdps-node
GDPS based on gdps cvolton (php), this gdps also based on js language.

## How to use
Simply start with this code.
```cmd
$ npm i
$ node .
```
And the server will host port 8000 by default. If you see OK on `http://localhost:8000`, you are ready to use.
Oh yes, I forgot that the GD server should be on `/database` and will return to `-1` as a 404 not found.

## Configuration setup
There are 3 configuration types (configuration, chest rewards, and quests).

### Configuration:
```js
var configuration = {
  port: 8000,
  datapath: "/data"
}
```
For configuration has two subject (port, datapath)
- `port:` is for webserver of port that will use `8000`, you can change it to port 80 or above. 
- `datapath:` is for data save to `/data` (database, levels, accounts, caches, songs).

### Quests: 
```js
var quests = [{
  type: 1,
  name: "Collect orbs",
  amount: 1000,
  rewards: 10
}]
```
For quests has 4 subjects (type, name, amount, rewards)
- `type:` is for that you need to collect to:
```txt
1 - orbs
2 - coins
3 - stars
```
- `name:` is for title or name of the quest
- `amount:` is for collect amount of type's
- `rewards:` is for rewards amount of diamonds

so means of that quests configuration is
```
Collect 1000 amount of orbs, and you will get 10 diamonds as rewards. 
```

## Warning

This repository is still in development; you can read at [task.txt](task.txt).
Some functions may have bugs and errors!

## Credits
GDPS: [Cvolton](http://github.com/cvolton) - Getting output of gdps/gd <br>
GDBrowser: [GDColon](http://github.com/gdcolon)  - Thanks for xor script <br>
GDDocs: [Wyliemaster](http://github.com/Wyliemaster) - Getting post data of geometry dash and all about information <br>
