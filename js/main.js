(function(){
	
	let list_of_lists = [];

	class Tile extends PIXI.Container{
		constructor(row, col){
			super();
			this.k = Math.floor(Math.random() * 32);
			
			const SZ = 64;
			const s = this.s = new PIXI.Sprite(PIXI.Texture.WHITE);
			s.tint = 0x333399;
			s.width = SZ; s.height = SZ;
			
			s.anchor.set(0.5);
			s.interactive = true;
			s.buttonMode = true;

			s.on('pointerdown', () => {
				if (this.s.tint === 0x993333) return;
				this.k = (++ this.k) % 32;
				this.t.text = this.S;
				this.board.check_tile(row, col);
			});
			
			this.addChild(s);
			
			const style = new PIXI.TextStyle({ fontSize: 36, fontWeight: 'bold', fill: 'white'});
			const t = this.t = new PIXI.Text(this.S, style);
			t.anchor.set(0.5);
			t.position.set(s.x, s.y);
			this.addChild(t);
			
			this.position.set(SZ/2 + (SZ + 10) * col, SZ/2 + (SZ + 10) * row);
		}
		
		get L(){ return this.t.text; }
		get S(){ return String.fromCharCode('А'.charCodeAt(0) + this.k); }
		mark(){ this.s.tint = 0x993333; }
	}
	// Tile

	class Board extends PIXI.Container{
		constructor(n_row, n_col){
			super();
			this.tiles = {};
			this.n_row = n_row;
			this.n_col = n_col;
			
			for (let row = 0; row < n_row; ++row) {
				for (let col = 0; col < n_col; ++col) {
					let tile = new Tile(row, col);
					tile.board = this;
					this.addChild(tile);
					this.set_tile(row, col, tile);
				}
			}
			this.pivot.x = this.width  / 2;
			this.pivot.y = this.height / 2;
		}
		
		get_tile(row, col) { return this.tiles['_' + row + '_' + col]; }
		set_tile(row, col, value) { this.tiles['_' + row + '_' + col] = value; }
		
		check_tile(row, col)
		{
			// console.log(`-> ${row} : ${col}`);
			for (let c0 = 0; c0 <= col; ++c0) {
				for (let c1 = col; c1 < this.n_col; ++c1) {
					let s = '';
					for (let i = c0; i <= c1; ++i) {
						s += this.get_tile(row, i).L;
					}
					s = s.toLowerCase();
					if (list_of_lists[s.length].find(it => it === s)) {
						console.log('!', s);
						for (let i = c0; i <= c1; ++i) {
							this.get_tile(row, i).mark();
						}
					}
				}
			}
			for (let r0 = 0; r0 <= row; ++r0) {
				for (let r1 = row; r1 < this.n_row; ++r1) {
					let s = '';
					for (let i = r0; i <= r1; ++i) {
						s += this.get_tile(i, col).L;
					}
					s = s.toLowerCase();
					if (list_of_lists[s.length].find(it => it === s)) {
						console.log('!', s);
						for (let i = r0; i <= r1; ++i) {
							this.get_tile(i, col).mark();
						}
					}
				}
			}
		}
	}
	// Board
	
	const app = new PIXI.Application({ 
		width: 800, height: 600, 
		backgroundColor: 0x999999,
		antialiasing: true,
	});
	document.body.appendChild(app.view);
	
	PIXI.loader
		.add("word_rus.txt")
		.load(setup);

	function get_words(n_max) {
		let words = PIXI.loader.resources["word_rus.txt"].data;
		let list = [], minL = 100, maxL = 0;
		list = words.split('\r\n');
		list.forEach(it => { minL = Math.min(minL, it.length); maxL = Math.max(maxL, it.length) });
		
		for (let n = 0; n <= n_max; ++n) {
			list_of_lists[n] = list.filter(it => it.length === n);
		}
	}
	
	function setup() {
		get_words(8);
		const board = gBoard = new Board(8, 8);
		board.position.set(app.screen.width/2, app.screen.height/2);
		app.stage.addChild(board);
	}

})();
