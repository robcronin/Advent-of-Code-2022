import { sumArr } from '../utils/array';

type File = {
  name: string;
  size: number;
};

class Directory {
  name: string;
  parentDir: Directory | null;
  childDirs: Directory[] = [];
  files: File[] = [];
  private size: number | null = null;

  constructor(name: string, parentDir: Directory | null) {
    this.name = name;
    this.parentDir = parentDir;
  }

  private addChildDir = (childDir: Directory) => {
    this.childDirs.push(childDir);
  };
  private addFile = (file: File) => {
    this.files.push(file);
  };
  public getSize = (): number => {
    if (!this.size) {
      const files = sumArr(this.files, (file) => file.size);
      const dirs = sumArr(this.childDirs, (childDir) => childDir.getSize());
      this.size = files + dirs;
    }
    return this.size;
  };
  public parseLs = (lsOutputs: string[]): Directory[] => {
    const addedDirs: Directory[] = [];
    lsOutputs.forEach((lsOutput) => {
      const groups = lsOutput.match(
        new RegExp('^(dir ([a-z]+))|(([0-9]+) ([a-z.]+))$'),
      );
      if (!groups) throw new Error(`ls output is not valid: ${lsOutput}`);
      const [_, isDir, dirName, isFile, fileSize, fileName] = groups;
      if (isDir) {
        if (!this.childDirs.find((childDir) => childDir.name === dirName)) {
          const childDir = new Directory(dirName, this);
          this.addChildDir(childDir);
          addedDirs.push(childDir);
        } else {
          throw new Error(`dir already added: ${dirName}`);
        }
      } else if (isFile) {
        if (!this.files.find((file) => file.name === fileName)) {
          this.addFile({ name: fileName, size: +fileSize });
        }
      }
    });
    return addedDirs;
  };
}

class FileSystem {
  root: Directory;
  location: Directory;
  dirList: Directory[];
  totalStorage = 70000000;

  constructor() {
    const root = new Directory('/', null);
    this.root = root;
    this.location = root;
    this.dirList = [root];
  }
  private cd = (dir: string) => {
    if (dir === '/') {
      this.location = this.root;
    } else if (dir === '..') {
      if (!this.location.parentDir) throw new Error('Tried to cd .. in root');
      this.location = this.location.parentDir;
    } else {
      const location = this.location.childDirs.find(
        (childDir) => childDir.name === dir,
      );
      if (!location)
        throw new Error(`Tried to cd ${dir} in ${this.location.name}`);
      this.location = location;
    }
  };
  private ls = (lsOutputs: string[]) => {
    const addedDirs = this.location.parseLs(lsOutputs);
    addedDirs.forEach((addedDir) => {
      this.dirList.push(addedDir);
    });
  };
  public parseInstructions = (instructions: string[]) => {
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      if (instruction === '$ ls') {
        const lsOutputs = [];
        while (instructions[i + 1] && !instructions[i + 1].startsWith('$')) {
          lsOutputs.push(instructions[i + 1]);
          i++;
        }
        this.ls(lsOutputs);
      } else if (instruction.startsWith('$ cd')) {
        const cdDir = instruction.slice(5);
        this.cd(cdDir);
      }
    }
  };

  public getSumBelowThreshold = (threshold: number) => {
    return Object.values(this.dirList).reduce((sum, dir) => {
      const dirSize = dir.getSize();
      if (dirSize <= threshold) return sum + dirSize;
      return sum;
    }, 0);
  };

  public getBestFileToDeleteToMeetNeededSpace = (neededSpace: number) => {
    const unusedSpace = this.totalStorage - this.root.getSize();
    const neededToDelete = neededSpace - unusedSpace;
    return this.dirList.reduce((bestSize, dir) => {
      const dirSize = dir.getSize();
      if (dirSize > neededToDelete && dirSize < bestSize) {
        return dirSize;
      }
      return bestSize;
    }, this.totalStorage);
  };
}

export const day7 = (input: string[]) => {
  const fileSystem = new FileSystem();
  fileSystem.parseInstructions(input);
  return fileSystem.getSumBelowThreshold(100000);
};

export const day7part2 = (input: string[]) => {
  const fileSystem = new FileSystem();
  fileSystem.parseInstructions(input);
  return fileSystem.getBestFileToDeleteToMeetNeededSpace(30000000);
};
