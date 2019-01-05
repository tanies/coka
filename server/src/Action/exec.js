const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
exports.index = {

    needLogin: true,

    requestHandler: async ctx => {
        const { stdout } = execFile(
            '/Applications/VLC.app/Contents/MacOS/VLC', //应用程序路径
            ['-I dummy -vvv "rtsp://184.72.239.149/vod/mp4://BigBuckBunny_175k.mov" --sout="#transcode{vcodec=theo,vb=800,acodec=vorb,ab=128,channels=2,samplerate=44100}:http{mux=ogg,dst=:8889/cam}" --sout-all --sout-keep '], //执行命令
            {
                // cwd:'',
                // // env:'/Applications/VLC.app/Contents/MacOS/VCL',
                // shell:false
            }
        );


        console.log(stdout)
        return ctx.ajax({ code: 1, data: '1' });
    }
} 
