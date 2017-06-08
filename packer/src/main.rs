extern crate byteorder;

use std::env;
use std::path::Path;
use std::fs::File;
use std::io::{Read, Write};

use byteorder::{LittleEndian, ByteOrder};

struct ContractPackage {
    code: Vec<u8>,
    storage: Vec<([u8; 32], [u8; 32])>,
}

impl ContractPackage {
    fn with_code_from_file<P: AsRef<Path>>(p: P) -> ContractPackage {
        let mut code = Vec::new();
        let mut f = File::open(p).expect("Failed to read file");
        f.read_to_end(&mut code).expect("Failed to fetch data from file");

        ContractPackage {
            code: code,
            storage: Vec::new(),
        }
    }

    fn pack<P: AsRef<Path>>(&self, p: P) {
        let mut f = File::create(p).expect("Failed to create file");
        let mut len_slc = [0u8; 4];
        LittleEndian::write_u32(&mut len_slc, self.code.len() as u32);
        f.write_all(&len_slc).expect("Failed to write to the file");
        f.write_all(&self.code).expect("Failed to write to the file");
        for &(k, v) in self.storage.iter() {
            f.write_all(&k).expect("Failed to write to the file");
            f.write_all(&v).expect("Failed to write to the file");
        }
    }
}

fn main() {
    let args = env::args().collect::<Vec<_>>();
	if args.len() != 3 {
		println!("Usage: {} contract.wasm package.cbn", args[0]);
		return;
	}

    let package = ContractPackage::with_code_from_file(&args[1]);
    package.pack(&args[2]);
}