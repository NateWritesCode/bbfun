import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import { createFolderPathIfNeeded } from "@bbfun/utils";
import decompress from "decompress";

const filesHelper: {
	destFile: string;
	destPath: string;
	key: string;
	postProcess: (args: {
		destPath: string;
		destFile: string;
	}) => Promise<void>;
	url: string;
}[] = [
	{
		destFile: "schedule.csv",
		destPath: "../data/input/historical/schedule",
		key: "schedule",
		postProcess: async ({ destFile, destPath }) => {
			const files = await decompress(`${destPath}/${destFile}`);

			for (const file of files) {
				fs.writeFileSync(`${destPath}/${file.path}`, file.data);
			}

			fs.unlinkSync(`${destPath}/${destFile}`);
		},
		url: "https://www.retrosheet.org/schedule/schedule.zip",
	},
	{
		destFile: "parks.zip",
		destPath: "../data/input/historical/parks",
		key: "parks",
		postProcess: async ({ destPath, destFile }) => {
			const files = await decompress(`${destPath}/${destFile}`);

			const filesToSave = [
				{
					key: "parks.csv",
					path: "Ballpark Database 2019 Final Files/ParkConfig.csv",
				},
			];

			for (const fileToSave of filesToSave) {
				const fileToSaveContents = files.find(
					(file) => file.path === fileToSave.path,
				);

				if (!fileToSaveContents || !fileToSaveContents.data) {
					throw new Error(
						`Could not find file ${fileToSave.path} in ${destFile}`,
					);
				}

				fs.writeFileSync(
					`${destPath}/${fileToSave.key}`,
					fileToSaveContents.data,
				);
			}

			fs.unlinkSync(`${destPath}/${destFile}`);
		},
		url: "https://www.seamheads.com/ballparks/Seamheads_Ballpark_Database_2019.zip",
	},
];

async function downloadFile({
	destFile,
	destPath,
	url,
}: {
	destFile: string;
	destPath: string;
	url: string;
}) {
	const proto = !url.charAt(4).localeCompare("s") ? https : http;
	createFolderPathIfNeeded(destPath);
	const filePath = `${destPath}/${destFile}`;

	return new Promise(function (resolve, reject) {
		const file = fs.createWriteStream(filePath);
		let fileInfo: {
			mime: string;
			size: number;
		} | null = null;

		const request = proto.get(url, (response) => {
			if (response.statusCode !== 200) {
				fs.unlink(filePath, () => {
					reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
				});
				return;
			}

			const contentLength = response.headers["content-length"];
			const contentType = response.headers["content-type"];

			if (!contentLength) {
				reject(new Error("No content length!"));
				return;
			}

			if (!contentType) {
				reject(new Error("No content type!"));
				return;
			}

			fileInfo = {
				mime: contentType,
				size: Number(contentLength),
			};

			response.pipe(file);
		});

		// The destination stream is ended by the time it's called
		file.on("finish", () => resolve(fileInfo));

		request.on("error", (err) => {
			fs.unlink(filePath, () => reject(err));
		});

		file.on("error", (err) => {
			fs.unlink(filePath, () => reject(err));
		});

		request.end();
	});
}

for (const file of filesHelper) {
	await downloadFile({
		destFile: file.destFile,
		destPath: file.destPath,
		url: file.url,
	});
	await file.postProcess({
		destPath: file.destPath,
		destFile: file.destFile,
	});
}

const downloadFiles = async (keys: typeof filesHelper[0]["key"][]) => {
	const filesToDownload = filesHelper.filter((file) => keys.includes(file.key));

	for (const file of filesToDownload) {
		await downloadFile(file);
		await file.postProcess({
			destPath: file.destPath,
			destFile: file.destFile,
		});
	}
};

downloadFiles(["schedule"]);
